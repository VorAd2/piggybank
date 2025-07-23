<?php

namespace App\Controllers;

use App\Models\CampanhasModel;
use CodeIgniter\RESTful\ResourceController;
use App\Traits\Validate;
use App\Models\UserModel;
use App\Models\RegistroDoacoesModel;

class Campanhas extends ResourceController {
    protected $modelName = 'App\Models\CampanhasModel';
    protected $format = 'json';
    protected $campanhaModel;
    private   $userModel;
    private   $doacoesModel;

    // Trait de validação e bla bla bla
    use Validate;

    public function __construct(){
        $this->campanhaModel = new CampanhasModel();
        $this->userModel     = new UserModel();
        $this->doacoesModel  = new RegistroDoacoesModel();
    }
    // Rota que mostra todas as campanhas
    public function index(){

        $campanhas = $this->model->select('
                 id,
                 titulo,
                 meta,
                 recebido,
                 descricao,
                 fk_id_usuario_criador_campanha,
                 fk_id_entidade_criadora_campanha,
                 created_at,
                 updated_at
        ')->findAll();
        //$campanhas = $this->model->getCampanhasEEntidades();

        return $this->respond($campanhas);
    }

    // Rota que mostra uma campanha específica
    public function show($id = null){
        $campanha = $this->model->find($id);

        if($campanha){
            return $this->respond($campanha);
        }

        return $this->failNotFound("Campanha não encontrada");
    }

    // Método para criar uma campanha
    public function create(){
        // Pegando os dados da requisição
        // COMENTADO TAMBÉM, FRONT END ENVIANDO DADOS VIA JSON
        // $title          = $this->request->getPost('title');
        // $goal           = $this->request->getPost('goal');
        // $received       = $this->request->getPost('received');
        // $description    = $this->request->getPost('description');
        // $fkIdEntidade   = $this->request->getPost('fkIdEntidade');

        // PEGANDO OS DADOS VIA JSON

        $data = $this->request->getJSON(true);

        $title              = $data['title']        ?? null;
        $goal               = $data['goal']         ?? null;
        $received           = $data['received']     ?? 0;
        $description        = $data['description']  ?? null;
        $fkIdDonoCampanha   = $data['fkIdOwner']    ?? null;
        

        $thereisSomeFielEmpty = $this->isSomeValueNull([$title, $goal, $received, $description, $fkIdDonoCampanha]);

        if($thereisSomeFielEmpty){
            return $this->response->setJSON(['error' => 'Um ou mais campos vazios!']);
        }

        // Validações
        // Titulo
        $title = $this->escapeEntry($title);

        //Verifico se existe um usuário com o id informado
        $res = $this->userModel->userExists($fkIdDonoCampanha);

        if(!$res){
            return $this->response->setJSON(['error' => 'Usuário ou Entidade inexistentes!']);
        }

        // Flag pra armazenar se o usuário que abriu a campanha
        // é uma entidade ou um usuário comum
        $flagIsEntity = 0;
        $res['is_entidade'] == 1 ? $flagIsEntity = 1 : $flagIsEntity;

        // Se for um usuário comum, adiciono a chave estrangeira fk_id_usuario_criador_campanha
        if(!$flagIsEntity){
                $campanhaData = [
                'titulo'                            => $title,
                'meta'                              => $goal,
                'recebido'                          => $received,
                'descricao'                         => $description,
                'fk_id_usuario_criador_campanha'    => (int)$fkIdDonoCampanha
            ];

            if($this->campanhaModel->insert($campanhaData)){
                return $this->response->setJSON(['success' => 'Campanha cadastrada com sucesso!']);
            }else{
                return $this->response->setJSON(['error' => 'Erro ao cadastrar campanha!']);
            }

        }

        // Caso seja um usuário-entidade, ao invés de eu adicionar
        // o id na coluna fk_id_usuario_criador_campanha,
        // adiciono em fk_id_entidade_criadora_campanha
        $campanhaData = [
            'titulo'                            => $title,
            'meta'                              => $goal,
            'recebido'                          => $received,
            'descricao'                         => $description,
            'fk_id_entidade_criadora_campanha'  => (int)$fkIdDonoCampanha 
        ];

        if($this->campanhaModel->insert($campanhaData)){
            return $this->response->setJSON(['success' => 'Campanha cadastrada com sucesso!']);
        }else{
            return $this->response->setJSON(['error' => 'Erro ao cadastrar campanha!']);
        }
    }

    // Método para realizar uma doação
    public function donate(){
        // habilitando a porra do json
        $data = $this->request->getJSON(true);

        $idCampaign = $data['idCampaign']   ?? null;
        $idDonor    = $data['idDonor']      ?? null;
        $value      = $data['value']        ?? null;

        $thereisSomeFielEmpty = $this->isSomeValueNull([$idCampaign, $idDonor, $value]);

        if($thereisSomeFielEmpty){
            return $this->response->setJSON(['error' => 'Um ou mais campos vazios!']);
        }

        // Evito do gaiatinho doar um valor igual ou menor que zero
        if($value <= 0){
            return $this->response->setJSON(['error' => 'Valor de doação não permitido!']);
        }

        // Busco se o usuário existe no banco de dados
        $resDonor = $this->userModel->userExists($idDonor);
        
        // Se o doador não existe
        if(!$resDonor){
            return $this->response->setJSON(['error' => 'Doador inexistente!']);
        }

        // Faço a mesma coisa com a campanha
        $resCampaign = $this->campanhaModel->campaignExists($idCampaign);

        // Se a campanha ainda não existe
        if(!$resCampaign){
            return $this->response->setJSON(['error' => 'Campanha inexistente!']);
        }

        // Agora, salvo o registro da doação na tabela registro_doacoes e também aumento o campo 'recebido' na tabela campanha
        $registerDonate = [
            'fk_id_doador'      => $idDonor,
            'fk_id_campanha'    => $idCampaign,
            'valor_doado'       => $value
        ];

        // Tento inserir no banco de dados
        if($this->doacoesModel->insert($registerDonate)){
            // Se der certo a inserção, atualizo o valor total de dinheiro recebido por campanha
            $res = $this->campanhaModel->getCurrentValueReceived($idCampaign);

            $currentValueReceived = $res['recebido'];
            // Somo com o novo valor a ser doado
            $updateValue = $currentValueReceived + $value;
            
            // ATualizo o valor total recebido em uma campanha
            $this->campanhaModel->update($idCampaign, ['recebido' => $updateValue]);

            return $this->response->setJSON(['success' => 'Doação realizada com sucesso!']);
        }
        return $this->response->setJSON(['error' => 'Erro ao realizar doação!']);
        
    }
}