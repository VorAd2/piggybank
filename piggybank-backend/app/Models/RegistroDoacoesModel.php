<?php

namespace App\Models;

use CodeIgniter\Model;

class RegistroDoacoesModel extends Model{
    protected $table = 'registro_doacoes';
    protected $primaryKey = 'id';
    protected $allowedFields = ['id', 'fk_id_doador', 'fk_id_campanha', 'valor_doado', 'created_at', 'updated_at'];

    // busca todas as doações realizadas
    public function getAllDonates(){
        return $this->select()->findAll();
    }

}

