# M2C Digital - Teste Backend Senior [ EM PRODUÇÃO ]

Este repositório contém a implementação de uma aplicação backend em NodeJS utilizando NestJS, juntamente com um consumidor RabbitMQ em NodeJS, Rust e Go Lang. A aplicação utiliza PostgreSQL para dados relacionais e MongoDB para dados não relacionais.

## Tecnologias Utilizadas
- NodeJS
- NestJS
- RabbitMQ
- PostgreSQL
- MongoDB
- Docker
- Rust
- Go Lang

## Estrutura do Banco de Dados

### PostgreSQL (Dados Relacionais)
- **Users**
    - id: string (gerado com library cuid2)
    - email: string
    - password: string (criptografado com crypto por exemplo)
    - created_at: Date
    - updated_at: Date
    - deleted: bool

- **Companies**
    - id: string (gerado com library cuid2)
    - name: string
    - document: string
    - created_at: Date
    - updated_at: Date
    - deleted: bool

- **Campaigns**
    - id: string (gerado com library cuid2)
    - name: string
    - created_at: Date
    - updated_at: Date
    - deleted: bool

### MongoDB (Dados Não Relacionais)
- **Messages**
    - identifier: string (gerado com library cuid2)
    - phone_number: string
    - message: string
    - campaign_id: string
    - created_at: Date
    - updated_at: Date
    - deleted: bool

## Funcionalidades do Sistema

1. **API NestJS**
    - CRUD para usuários e empresas (PostgreSQL)
    - Sistema de autenticação para acesso às rotas de CRUD de campanhas
    - Soft delete para usuários, empresas e campanhas
    - Criação de campanhas e envio de arquivo texto com números
    - Envio de mensagens para uma fila RabbitMQ

2. **Consumer em NodeJS**
    - Recebe mensagens da fila RabbitMQ
    - Grava mensagens no MongoDB
    - Atualiza o status da campanha no PostgreSQL

3. **Consumer em Rust**
    - Funcionalidade idêntica ao consumer em NodeJS

4. **Consumer em Go Lang**
    - Funcionalidade idêntica ao consumer em NodeJS

## Instruções para Executar o Projeto

### Pré-requisitos
- Docker e Docker Compose
- NodeJS instalado
- Rust instalado
- Go Lang instalado
- Conta no CloudAMQP ou instância RabbitMQ local

### Passos para Executar

1. Clone o repositório:
   ```sh
   git clone [<URL_DO_REPOSITORIO>](https://github.com/douglas-dreer/yggdrasil-server)
   cd <NOME_DO_REPOSITORIO>
2. https://web.postman.co/workspace/54603e3a-4b7e-4689-82c4-4e90e257d5dc/documentation/1246389-1772028b-231a-41bf-88c8-096dec247a79
