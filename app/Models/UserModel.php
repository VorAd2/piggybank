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
}