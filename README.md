# Desafio Técnico - Blue Rise Group (Auth System)

Este projeto consiste em um sistema de autenticação completo desenvolvido para o desafio da Blue Rise Group. A aplicação utiliza **Node.js**, **MongoDB** para persistência de dados e **Redis** para gerenciamento de sessões e logout (Stateful JWT).

## Funcionalidades

- **Cadastro de Usuários**: Armazenamento seguro com criptografia de senha via `bcrypt`.
- **Autenticação JWT**: Geração de tokens JSON Web Token para acesso a rotas protegidas.
- **Gerenciamento de Sessão com Redis**: O token é validado no Redis com expiração automática de 15 minutos.
- **Logout Seguro**: Invalidação imediata da sessão no Redis (comando DEL), garantindo que o token não possa mais ser usado.
- **Interface Web**: Interface responsiva em HTML/CSS para Cadastro, Login e Dashboard.

## Tecnologias Utilizadas

- **Node.js** & **Express** (Backend)
- **MongoDB** via Mongoose (Banco de dados principal)
- **Redis** via Docker (Cache de sessões)
- **JSON Web Token** (Segurança)
- **Bcrypt** (Criptografia de senhas)
- **CORS** (Permissão de acesso entre front e back)

## Pré-requisitos

Antes de começar, você vai precisar ter instalado:
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/) (para rodar o Redis)
- Uma instância do [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

## 🔧 Configuração do Projeto

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/fmaranhuk/desafio-bluerise.git](https://github.com/fmaranhuk/desafio-bluerise.git)
   cd desafio-bluerise