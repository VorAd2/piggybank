# piggybank
## 👤 API - Gerenciamento de campanhas e doações
Projeto Final referente à disciplina de Práticas Profissionais II, esta lecionada pelo professor José Roberto, no IFCE.
Nosso projeto consiste em um sistema eficiente de abertura e doação para campanhas dos mais variados tipos.

Esta seção da API é responsável pela criação (e autenticação) de usuários, criação de campanhas e registro de doações.

---

## 📌 Rotas

### 🚀 GET

#### 🔹 `GET /users`
Retorna a lista de todos os usuários cadastrados no sistema.

#### 🔹 `GET /campanhas`
Retorna a lista de todas as campanhas cadastradas no sistema.


### 🚀 POST
#### 🔹 `POST /users/create`
Cria um novo usuário no sistema


***Exemplo de envio (JSON)***
```json
{
    "name": "fulano",
    "email" "fulano@email.com",
    "password": "senhaSecretaDoFulano",
    "phone": "(xx) x xxxx-xxxx",
    "cpf": "XXX.XXX.XXX-XX"
}
```
Observação: É optativo o uso de hífens, parêntesis e pontos no envio dos dados.


#### 🔹 `POST /entidades/create`
Cria uma nova entidade no sistema


***Exemplo de envio (JSON)***
```json
{
    "name": "fulano",
    "email" "fulano@email.com",
    "password": "senhaSecretaDoFulano",
    "phone": "(xx) x xxxx-xxxx",
    "cnpj": "XX.XXX.XXX/XXXX-XX"
}
```
Observação: É optativo o uso de hífens, parêntesis e pontos no envio dos dados.



#### 🔹 `POST /campanhas/create`
Abre uma nova campanha no sistema


***Exemplo de envio (JSON)***
```json
{
    "title": "titulo da campanha",
    "goal": 1000,
    "received": 0,
    "description": "descrição da campanha",
    "idOwner": "id do usuário que está abrindo a campanha"
}
```
#### 🔹 `POST /donate`
Realiza uma doação para uma campanha existente no sistema


***Exemplo de envio (JSON)***
```json
{
    "idCampaign": "id da campanha",
    "idDonor": "id do doador",
    "value": 100
}
```


#### 🔹 `POST /login`
Loga no sistema


***Exemplo de envio (JSON)***
```json
{
    "email": "fulano@email.com",
    "password": "senhaSecretaDoFulano"
}
```
