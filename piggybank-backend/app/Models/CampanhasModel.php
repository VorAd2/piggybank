<?php

namespace App\Models;

use CodeIgniter\Model;

class CampanhasModel extends Model{
    protected $table = 'campanhas';
    protected $primaryKey = 'id';
    protected $allowedFields = ['id','titulo','meta','recebido','descricao', 'fk_id_usuario_criador_campanha', 'fk_id_entidade_criadora_campanha'];

    // Método que retorna a campanha junto da entidade que a gerou
    public function getCampanhasEEntidades(){
        return $this->select('campanhas.*, entidades.nome AS entidade_nome, entidades.email AS entidade_contato')
        ->join('entidades', 'entidades.id = campanhas.fk_id_entidade')
        ->findAll();
    }

    // Método que verifica se existe um usuário no banco com o id informado
    public function campaignExists($idCampaign): mixed {
        // return $this->select()->where('id', $idUser)->find();
        $res = $this->select()->find($idCampaign);
        
        if(is_null($res)){
            return false;
        }

        return $res;
    }

    // Método para pegar o valor atual de dinheiro recebido em uma campanha
    public function getCurrentValueReceived($idCampaign){
        $res = $this->select('recebido')->find($idCampaign);

        if(is_null($res)){
            return false;
        }

        return $res;
    }


}

