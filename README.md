# Desafio BlueRise - API de Autenticacao

Este projeto consiste em uma API de autenticacao desenvolvida em Node.js, utilizando MongoDB para persistencia de dados e Redis para gerenciamento de sessoes. A aplicacao permite o registro de usuarios, login com geracao de Token JWT e encerramento de sessao (logout).

## Tecnologias Utilizadas

* Node.js e Express
* MongoDB e Mongoose
* Redis
* JSON Web Token (JWT)
* Bcrypt (Hash de senhas)
* Docker e Docker Compose

## Estrutura do Projeto

* index.js: Ponto de entrada e conexoes principais.
* src/controllers/AuthController.js: Logica de registro, login e logout.
* src/middlewares/auth.js: Validacao de token e sessao no Redis.
* src/models/Users.js: Esquema do usuario no MongoDB.
* Dockerfile: Instrucoes de construcao da imagem da aplicacao.
* docker-compose.yml: Orquestracao dos containers.

## Como Visualizar o Resultado

O projeto ja esta em producao e pode ser testado diretamente atraves do link de deploy ou localmente via Docker.

### 1. Execucao via Docker (Recomendado)

1. Certifique-se de ter o Docker instalado.
2. Na raiz do projeto, execute:
   docker-compose up -d --build

### 2. Enderecos Locais (Apos subir os containers)

* Aplicacao: http://localhost:3000
* Banco de Dados (MongoDB): localhost:27017
* Cache (Redis): localhost:6380

### 3. Teste dos Endpoints (Deploy Online)

URL Base: https://desafio-bluerise-production.up.railway.app

* Registro: POST /register
  Corpo (JSON): { "email": "usuario@email.com", "password": "123" }

* Login: POST /login
  Corpo (JSON): { "email": "usuario@email.com", "password": "123" }

* Logout (Protegido): POST /logout
  Cabecalho: Authorization: Bearer [TOKEN_AQUI]

## Comandos Uteis de Gerenciamento

Caso esteja utilizando Docker para rodar o projeto localmente, utilize os comandos abaixo:

# Ver status dos containers
docker-compose ps

# Ver logs em tempo real da API
docker-compose logs -f app

# Ver logs do Banco de Dados (MongoDB)
docker-compose logs -f mongodb

# Ver logs do Cache (Redis)
docker-compose logs -f redis

# Parar os containers
docker-compose down

# Reiniciar a aplicacao
docker-compose restart

## Fluxo de Autenticacao

1. Registro: Usuario salvo no MongoDB com senha criptografada.
2. Login: Geracao de JWT e armazenamento do token no Redis com TTL.
3. Middleware: Requisicoes protegidas validam o token diretamente no Redis.
4. Logout: Remocao da chave no Redis, invalidando o acesso imediatamente.