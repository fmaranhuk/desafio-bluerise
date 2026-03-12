# Desafio Blue Rise - Sistema de Login Seguro

Este projeto é uma solução completa de autenticação desenvolvida para o desafio técnico da **Blue Rise Group**. A aplicação utiliza **Node.js**, **MongoDB** e **Redis** para garantir um sistema de login robusto, seguro e escalável.

🔗 **[CLIQUE AQUI PARA TESTAR A APLICAÇÃO ONLINE (DEPLOY)]**
*desafio-bluerise-production.up.railway.app*

---

## Tecnologias Utilizadas

- **Runtime:** Node.js
- **Framework:** Express
- **Banco de Dados NoSQL:** MongoDB Atlas (Nuvem)
- **Cache/Session:** Redis (Armazenamento de Tokens e Logout)
- **Segurança:** JSON Web Tokens (JWT) e Bcrypt para hash de senhas
- **Infraestrutura:** Docker e Docker Compose
- **Hospedagem:** Railway (Deploy contínuo)

---

## Diferenciais Implementados

Conforme sugerido no documento do desafio, foram aplicadas as seguintes melhorias:

1.  **Armazenamento em Redis:** Os tokens JWT são gerenciados via Redis para permitir a invalidação real do acesso no momento do Logout.
2.  **Deploy em Ambiente Gratuito:** Aplicação totalmente funcional hospedada no Railway.
3.  **Banco de Dados na Nuvem:** Integração com MongoDB Atlas.
4.  **Containerização:** Dockerização completa da aplicação para facilitar o desenvolvimento local.

---

## Como Rodar o Projeto Localmente

### Pré-requisitos
- Docker e Docker Compose instalados.

### Passo a Passo
1. Clone o repositório:
   ```bash
   git clone [https://github.com/fmaranhuk/desafio-bluerise.git](https://github.com/fmaranhuk/desafio-bluerise.git)
   cd desafio-bluerise