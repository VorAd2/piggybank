<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model{
    protected $table         = 'users';
    protected $primaryKey    = 'id';
    protected $allowedFields = ['id', 'name', 'tel', 'email', 'cpf', 'senha', 'pfp_img', 'bio', 'created_at', 'updated_at', 'cnpj', 'is_entidade'];
    protected $useTimestamps = true;

    // Método pra checar se o usuário já existe no banco de dados
    public function userAlreadyExists(string $email): mixed {
        $userExists = $this->select()->where('email', $email)->first();
        
        if(!is_null($userExists)){
            return true;
        }

        return false;
    }

    // Método para retornar a senha encriptada do banco para o controller
    public function getEncUserPassword($email): string {
        $encPassword = $this->select('senha')->where('email', $email)->first();

        return $encPassword['senha'];
    }

    // Método que verifica se existe um usuário no banco com o id informado
    public function userExists($idUser): mixed {
        // return $this->select()->where('id', $idUser)->find();
        $res = $this->select()->find($idUser);

        if(is_null($res)){
            return false;
        }

        return $res;
    }

    /*  Rota com o superGet que o dev frontend solicitou
        Essa rota DEVE RETORNAR: 
            id do usuário,
            tipo de usuario,
            nome do usuário,
            email do usuário,
            id das campanhas as quais ele abriu,
            quando abriu a campanha,
            id das campanhas as quais ele doou,
            quanto doou e quando doou
    */
    public function superGet(){
        // query crua foda-se o querybuilder
        $sql = "
            SELECT
                users.id AS id_usuario,
                users.name AS nome_usuario,
                users.email AS email_usuario,
                users.is_entidade AS is_entidade,
                campanhas.id AS id_campanha_apoiada,
                campanhas.titulo AS titulo_campanha_apoiada,
                campanhas.created_at AS campanha_aberta_em,
                registro_doacoes.valor_doado AS valor_doado,
                registro_doacoes.created_at AS data_de_doacao
            FROM registro_doacoes
            JOIN users ON users.id = registro_doacoes.fk_id_doador
            JOIN campanhas ON campanhas.id = registro_doacoes.fk_id_campanha
        ";

        $query  = $this->db->query($sql);
        $result = $query->getResult();

        $agrupado = [];
        // Agrupa registros em comum
        foreach ($result as $row) {
            $id_usuario = $row->id_usuario;

            if (!isset($agrupado[$id_usuario])) {
                $agrupado[$id_usuario] = [
                    'id_usuario'    => $row->id_usuario,
                    'nome_usuario'  => $row->nome_usuario,
                    'email_usuario' => $row->email_usuario,
                    'is_entidade'   => $row->is_entidade,
                    'campanhas'     => []
                ];
            }

            $agrupado[$id_usuario]['campanhas'][] = [
                'id_campanha_apoiada'     => $row->id_campanha_apoiada,
                'titulo_campanha'         => $row->titulo_campanha_apoiada,
                'campanha_aberta_em'      => $row->campanha_aberta_em,
                'valor_doado'             => $row->valor_doado,
                'data_de_doacao'          => $row->data_de_doacao,
            ];
        }
        // retorna essa porra com chaves indexadas [0, 1, 2 ... n]
        return array_values($agrupado);
    }

   
}

