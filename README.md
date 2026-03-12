# Desafio Técnico - Blue Rise Group (Auth System)

Este projeto consiste em um sistema de autenticação completo desenvolvido para o desafio da Blue Rise Group. A aplicação utiliza **Node.js**, **MongoDB** para persistência de dados e **Redis** para gerenciamento de sessões e logout.

## 🚀 Funcionalidades

- **Cadastro de Usuários**: Armazenamento seguro com criptografia de senha (bcrypt).
- **Autenticação JWT**: Geração de tokens para acesso a rotas protegidas.
- **Gerenciamento de Sessão com Redis**: O token é armazenado no Redis com expiração de 15 minutos.
- **Logout Seguro**: Remoção imediata do token da sessão no Redis ao deslogar.
- **Interface Web**: Página simples em HTML/CSS para realizar Cadastro, Login e Logout.

## 🛠️ Tecnologias Utilizadas

- **Node.js** & **Express**
- **MongoDB** (via Mongoose)
- **Redis** (Docker)
- **JSON Web Token (JWT)**
- **Bcrypt** (Criptografia)
- **CORS** (Integração Front/Back)

## 📋 Pré-requisitos

Antes de começar, você vai precisar ter instalado:
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/) (para rodar o Redis)
- Uma conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 🔧 Configuração do Projeto

1. **Clone o repositório:**
   ```bash
   git clone <link-do-seu-repositorio>
   cd <nome-da-pasta>