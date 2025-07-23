<?php

namespace App\Controllers;

use App\Models\UserModel;
use App\Models\RegistroDoacoesModel;
use CodeIgniter\RESTful\ResourceController;
use App\Traits\Validate;
use Exception;

class Users extends ResourceController {
    // Trait
    use Validate;

    protected $modelName = 'App\Models\UserModel';
    protected $format = 'json';
    protected $userModel;
    protected $registroDoacoesModel;
    protected $defaultPfp;


    // Algumas constantes
    const CPF_LENGHT    = 11;
    const PHONE_LENGHT  = 11;

    // construtor para injeção
    public function __construct(){
        $this->userModel = new UserModel();
        $this->registroDoacoesModel = new RegistroDoacoesModel();

        $this->defaultPfp = base_url('img/default/default_pfp.png');
    }

    // Método que retorna todos os usuários na api
    public function index(){

        $allUsers = $this->model->select('id, name, email, pfp_img')->findAll();

        // Verifica se o usuario enviou uma foto de perfil personalizada
        foreach($allUsers as &$user){
            if($user['pfp_img'] != NULL){
                $pfpName = basename($user['pfp_img']);
                $user['pfp_img_serve'] = base_url('uploads/img/pfp/' . $pfpName);
            }
        }
    
        return $this->respond($allUsers);
        
    }

    // rota GET que busca um usuário com base no id
    // ex.: api/users/1
    // retorna o usuário de id 1
    public function show($id = null){
        $user = $this->model->select('name, email, pfp_img')->find($id);

        //servindo a foto do unico usuário
        if($user){
            if($user['pfp_img']){
                $pfpName = basename($user['pfp_img']);
                $user['pfp_img_serve'] = base_url('uploads/img/pfp/' . $pfpName);
            }
            return $this->respond($user);
        }

        return $this->failNotFound("Usuário não encontrado");
    }

    // Método para login
    public function login(){
        $data = $this->request->getJSON(true);

        $email          = $data['email']    ?? null;
        $password       = $data['password'] ?? null;

        // echo "[DBG LOGIN]\n [login]: {$email}\n [senha]: {$password}\n"; die();

        // Agora eu busco no banco de dados se existe um usuário com esse EMAIL
        $emailExists = $this->userModel->userAlreadyExists($email);
        
        // Se o email não existe, lanço um erro
        if(!$emailExists){
            return $this->response->setJSON(['error' => 'Este email não existe!']);
        }
        
        // Se o email existe, checo se as senhas batem
        // no meu caso, a senha armazenada no banco é sempre
        // hasheada via BCRYPT
        $encUsersPasswordFromDB = $this->userModel->getEncUserPassword($email);


        if(!password_verify($password, $encUsersPasswordFromDB)){
            return $this->response->setJSON(['error' => 'Senha inválida']);
        }
        
        // Respondendo para o frontend que o login foi bem-sucedido
        return $this->response->setJSON(
            [
                'status' => 200,
                'message' => [
                    'loggedIn' => true
                ]
            ]
        );
    }

    // rota POST para criar um usuario
    public function create(){
        
        // recebendo os dados via post
        // COMENTADO: FRONT END ESTÁ ENVIANDO DADOS VIA JSON
        // E NÃO FORM-URL-ENCODED
        // $name       = $this->request->getPost('name');
        // $email      = $this->request->getPost('email');
        // $password   = $this->request->getPost('password');
        // $tel        = $this->request->getPost('phone');
        // $cpf        = $this->request->getPost('cpf');
        // $pfpImg     = $this->request->getFile('pfpImg'); // Recebe uma imagem

        // habilitando o envio por json
        $data = $this->request->getJSON(true);
        // print_r($data); die();
        // capturando o diabo dos dados, mas em JSON
        $name           = $data['name']     ?? null;
        $email          = $data['email']    ?? null;
        $password       = $data['password'] ?? null;
        $tel            = $data['phone']    ?? null;
        $cpf            = $data['cpf']      ?? null;
        $pfpImg         = $data['pfpImg']   ?? null;

        // Checando se o usuário já existe
        $response = $this->userModel->userAlreadyExists($email);

        if($response){ // Caso exista, retorno um erro
            return $this->response->setJSON(['error' => 'Já existe um usuário com esse email!']);
        }
        
        // Verifica se o usuário mandou uma imagem própria
        // ou se optou por escolher uma imagem default
        $useDefaultProfilePicture = $this->useDefaultPfp($pfpImg);

        // Caso tenha sido enviada uma imagem pessoal
        // Salvo o nome da imagem no banco
        if($useDefaultProfilePicture == false){

            // verifica se é uma imagem permitida
            $tiposImg = ['image/jpeg', 'image/jpg', 'image/png'];
            $mime = $pfpImg->getMimeType();

            if(!in_array($mime, $tiposImg)){
                return $this->response->setJSON(['error' => 'Tipo de imagem inválida!']);
            }

            // Gerar um nome unico para a imagem
            $newPfpName = $pfpImg->getRandomName();
            
            // move a foto pro diretorio
            $pfpImg->move(WRITEPATH . 'uploads/img/pfp', $newPfpName);
        }
        

        // se os dados não tiverem sido enviados corretamente
        // retorna um erro nessa porra
        $thereIsSomeFieldEmpty = $this->isSomeValueNull([$name, $email, $password, $tel, $cpf]);
        
        // Retorna erro pro caba
        if($thereIsSomeFieldEmpty){
            return $this->response->setJSON(['error' => 'Um ou mais campos vazios!']);
        }

        // VALIDAÇÃO DOS DADOS
        
        // NOME
        $name = $this->escapeEntry($name);

        // SENHA
        // Remove os espaços da senha
        $password = $this->removeSpaces($password);

        // Verifica se a senha é válida ou não
        $isAnValidPassword = $this->isThisPasswordValid($password);

        if(!$isAnValidPassword){
            return $this->response->setJSON(['error' => 'Senha inválida!']);
        }

        // Criptografando a senha
        $passwordEnc = password_hash($password, PASSWORD_BCRYPT);

        // EMAIL
        // Sanitiza o email
        $email = $this->sanitizeEmail($email);

        // Depois de sanitizar, vê se é um email válido
        $isAnValidEmail = $this->isThisEmailValid($email);

        // Se, mesmo após sanitizar o email, este ainda for inválido
        // Retorna uma mensagem de erro
        if(!$isAnValidEmail){
            return $this->response->setJSON(['error' => 'Email inválido!']);
        }

        // TELEFONE
        // Sanitizando um número de telefone brasileiro
        $tel = $this->sanitizePhoneNumber($tel);

        // Agora verificando se é um telefone no formato válido
        $isAValidPhoneNumber = $this->validatePhoneNumber($tel);

        if(!$isAValidPhoneNumber){
            return $this->response->setJSON(['error' => 'Telefone inválido!']);
        }

        // CPF
        // Sanitizando
        $cpf         = $this->sanitizeCPF($cpf);
        $isAValidCPF = $this->isAValidCPF($cpf);

        if(!$isAValidCPF){
            return $this->response->setJSON(['error' => 'CPF inválido!']);
        }

        $userData = [
            'name'  => $name,
            'tel'   => $tel,
            'email' => $email,
            'cpf'   => $cpf,
            'senha' => $passwordEnc,
            // Se o usuário estiver usando a foto de perfil padrão,
            // adiciono o valor NULL no campo da foto
            'pfp_img' => $useDefaultProfilePicture == true ? null : $newPfpName
        ];

        // Inserção do usuário no banco de dados
        
        if($this->userModel->insert($userData)){
            return $this->response->setJSON(['success' => 'Usuário criado com sucesso!']);
        }else{
            return $this->response->setJSON(['error' => 'Erro ao criar usuário!']);
        }
        
    }

    // rota POST para criar uma entidade
    public function createEntity(){
        
        // recebendo os dados via post
        // COMENTADO: FRONT END ESTÁ ENVIANDO DADOS VIA JSON
        // E NÃO FORM-URL-ENCODED
        // $name       = $this->request->getPost('name');
        // $email      = $this->request->getPost('email');
        // $password   = $this->request->getPost('password');
        // $tel        = $this->request->getPost('phone');
        // $cnpj       = $this->request->getPost('cnpj');
        // $pfpImg     = $this->request->getFile('pfpImg'); // Recebe uma imagem

        // habilitando o envio por json
        $data = $this->request->getJSON(true);
        // print_r($data); die();
        // capturando o diabo dos dados, mas em JSON
        $name           = $data['name']     ?? null;
        $email          = $data['email']    ?? null;
        $password       = $data['password'] ?? null;
        $tel            = $data['phone']    ?? null;
        $cnpj           = $data['cnpj']     ?? null;
        $pfpImg         = $data['pfpImg']   ?? null;

        // Checando se o usuário já existe
        $response = $this->userModel->userAlreadyExists($email);

        if($response){ // Caso exista, retorno um erro
            return $this->response->setJSON(['error' => 'Já existe uma entidade com esse email!']);
        }
        
        // Verifica se o usuário mandou uma imagem própria
        // ou se optou por escolher uma imagem default
        $useDefaultProfilePicture = $this->useDefaultPfp($pfpImg);

        // Caso tenha sido enviada uma imagem pessoal
        // Salvo o nome da imagem no banco
        if($useDefaultProfilePicture == false){

            // verifica se é uma imagem permitida
            $tiposImg = ['image/jpeg', 'image/jpg', 'image/png'];
            $mime = $pfpImg->getMimeType();

            if(!in_array($mime, $tiposImg)){
                return $this->response->setJSON(['error' => 'Tipo de imagem inválida!']);
            }

            // Gerar um nome unico para a imagem
            $newPfpName = $pfpImg->getRandomName();
            
            // move a foto pro diretorio
            $pfpImg->move(WRITEPATH . 'uploads/img/pfp', $newPfpName);
        }
        

        // se os dados não tiverem sido enviados corretamente
        // retorna um erro nessa porra
        $thereIsSomeFieldEmpty = $this->isSomeValueNull([$name, $email, $password, $tel, $cnpj]);
        
        // Retorna erro pro caba
        if($thereIsSomeFieldEmpty){
            return $this->response->setJSON(['error' => 'Um ou mais campos vazios!']);
        }

        // VALIDAÇÃO DOS DADOS
        
        // NOME
        $name = $this->escapeEntry($name);

        // SENHA
        // Remove os espaços da senha
        $password = $this->removeSpaces($password);

        // Verifica se a senha é válida ou não
        $isAnValidPassword = $this->isThisPasswordValid($password);

        if(!$isAnValidPassword){
            return $this->response->setJSON(['error' => 'Senha inválida!']);
        }

        // Criptografando a senha
        $passwordEnc = password_hash($password, PASSWORD_BCRYPT);

        // EMAIL
        // Sanitiza o email
        $email = $this->sanitizeEmail($email);

        // Depois de sanitizar, vê se é um email válido
        $isAnValidEmail = $this->isThisEmailValid($email);

        // Se, mesmo após sanitizar o email, este ainda for inválido
        // Retorna uma mensagem de erro
        if(!$isAnValidEmail){
            return $this->response->setJSON(['error' => 'Email inválido!']);
        }

        // TELEFONE
        // Sanitizando um número de telefone brasileiro
        $tel = $this->sanitizePhoneNumber($tel);

        // Agora verificando se é um telefone no formato válido
        $isAValidPhoneNumber = $this->validatePhoneNumber($tel);

        if(!$isAValidPhoneNumber){
            return $this->response->setJSON(['error' => 'Telefone inválido!']);
        }

        // CNPJ
        // Sanitizando
        $cnpj        = $this->sanitizeCNPJ($cnpj);
        $isAValidCNPJ = $this->isAValidCNPJ($cnpj);

        if(!$isAValidCNPJ){
            return $this->response->setJSON(['error' => 'CNPJ inválido!']);
        }

        $userData = [
            'name'          => $name,
            'tel'           => $tel,
            'email'         => $email,
            'cnpj'          => $cnpj,
            'senha'         => $passwordEnc,
            // Se o usuário estiver usando a foto de perfil padrão,
            // adiciono o valor NULL no campo da foto
            'pfp_img'       => $useDefaultProfilePicture == true ? null : $newPfpName,
            'is_entidade'   => true
        ];

        // var_dump($userData);
        // die();


        // Inserção do usuário no banco de dados
        
        if($this->userModel->insert($userData)){
            return $this->response->setJSON(['success' => 'Entidade criada com sucesso!']);
        }else{
            return $this->response->setJSON(['error' => 'Erro ao criar entidade!']);
        }
        
    }

    // rota com uns joins aí
    public function superGet(){
        $data = $this->userModel->superGet();
        return $this->response->setJSON($data);
    }
}