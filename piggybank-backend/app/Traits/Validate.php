<?php

namespace App\Traits;

// Trait para reultilização de métodos entre classes

trait Validate {

    // Não vou questionar sua cognição
    public function isSomeValueNull(array $array): bool {
        foreach($array as $key => $value){
            // echo "[{$key}]: {$value}\n";
            if(is_null($value)) { // evita falsy
                // echo "[debug] key vazia: {$key} {$value}\n"; die();
                return true;
            }
        }
        
        // Caso não haja nenhum campo vazio (o que é o esperado), retorna false
        return false;
    }

    // Método que retorna se um email é válido ou não
    public function isThisEmailValid(string $email): bool {

        $isAnValidEmail = filter_var($email, FILTER_VALIDATE_EMAIL);        

        if(!$isAnValidEmail){
            return false;
        }

        return true;
    }

    // Método que sanitiza um email
    public function sanitizeEmail(string $email): string {

        $emailSanitized = filter_var($email, FILTER_SANITIZE_EMAIL);

        return $emailSanitized;
    }

    // Método para sanitizar/escapar uma entrada genérica como nomes
    public function escapeEntry(string $data): string {
        // Remove números e caracteres especiais
        
        $dataEscaped = preg_replace('/[^\p{L} ]/u', '', $data);

        // Evita XSS
        $dataEscaped = htmlspecialchars($dataEscaped, ENT_QUOTES, 'UTF-8');

        return $dataEscaped;
    }

    // Não vou questionar sua cognição...
    public function removeSpaces(string $password): string {

        $passwordWithoutSpaces = str_replace(' ', '', $password);

        return $passwordWithoutSpaces;
    }

    // Método que verifica se a senha é valida com base naqueles caracteres
    // caso o cara tenha inserido uma senha qe possua um caractere diferente daqueles,
    // retorna false
    public function isThisPasswordValid(string $password): bool {
        return !preg_match('/[^a-zA-Z0-9!@#$%&*()_=+-]/', $password);
    }

    // Método para sanitizar um número de telefone
    public function sanitizePhoneNumber(string $phoneNumber): string {
        // Remove os caracteres especiais mais communs inseridos
        // pelos usuários quando vão enviar um número de telefone
        $phoneNumber = str_replace(' ', '', $phoneNumber);
        $phoneNumber = str_replace('(', '', $phoneNumber);
        $phoneNumber = str_replace(')', '', $phoneNumber);
        $phoneNumber = str_replace('-', '', $phoneNumber);
        $phoneNumber = str_replace('+', '', $phoneNumber);

        return $phoneNumber;
    }

    // Método para validar número de telefone
    public function validatePhoneNumber(string $phoneNumber): bool {

        // se o telefone for menor que 9 ou maior que 11 digitos
        // é um telefone inválido
        if( (strlen($phoneNumber) < 9) || (strlen($phoneNumber) > 11) ){
            return false;
        }

        // Checa se o usuário (mesmo após a sanitização) enviou algum caractere que não número
        return !preg_match('/[^0-9]/', $phoneNumber);
    }

    // Método para sanitizar um CPF,
    // removendo pontos e hífens
    public function sanitizeCPF(string $cpf): string {

        $cpf = str_replace(' ', '', $cpf);
        $cpf = str_replace('.', '', $cpf);
        $cpf = str_replace('-', '', $cpf);

        return $cpf;
    }

    // Verifica se, após a remoção dos caracteres especiais, é um cpf válido
    public function isAValidCPF(string $cpf): bool {
        
        // Nesse caso, não vou programar um algoritmo (ou usar um regex) para verificar se realmente
        // é um cpf válido. Vou apenas checar ser o cpf possui 11 dígitos numéricos
        
        $cpfLenght = strlen($cpf);

        if($cpfLenght !== 11){
            return false;
        }

        // se o tamanho for correto, verifico se o cpf possui apenas dígitos

        $thereAreOnlyDigits = !preg_match('/[^0-9]/', $cpf);

        if(!$thereAreOnlyDigits){
            return false;
        }

        return true;

    }

    // Método que verifica se o usuário enviou uma imagem
    public function useDefaultPfp($profilePicture): bool {

        $useDefaultProfilePicture = false;

        // Checa se o usuário enviou uma imagem personalizada ou não na criação da conta
        if(!$profilePicture || $profilePicture->getError()){
            // Caso ele não tenha enviado uma imagem própria,
            // acabo usando uma imagem padrão
            $useDefaultProfilePicture = true;
        }
        // Se não tiver mandado a imagem: retorna 1
        // Se tiver mandado, retorna 0
        return $useDefaultProfilePicture;
    }

    // Sanitizando CNPJ alfanumerico
    public function sanitizeCNPJ(string $cnpj): string {

        // removendo os caracteres indesejados
        $cnpj = str_replace(' ', '', $cnpj);
        $cnpj = str_replace('.', '', $cnpj);
        $cnpj = str_replace('-', '', $cnpj);
        $cnpj = str_replace('/', '', $cnpj);

        return $cnpj;
    }

    // Validando CNPJ
    // Nesse caso, vai ser uma validação bem da fuleragem,
    // Vou só checar se o tamanho está certo e retornar true
    public function isAValidCNPJ(string $cnpj): bool {

        
        $cnpjLenght = strlen($cnpj);

        if($cnpjLenght !== 14){
            return false;
        }

        return true;

    }
}