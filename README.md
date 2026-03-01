# Portal de Serviços ST - Backend

Este é o core administrativo do Portal de Serviços ST, desenvolvido com **NestJS**. O sistema gerencia o cadastro de empresas (Pessoa Física, Jurídica e Estrangeira), fluxos de aprovação interna e integração de arquivos.

## Tecnologias
- **Framework:** NestJS
- **Banco de Dados:** PostgreSQL (TypeORM)
- **Documentação:** Swagger/OpenAPI
- **Validação:** Class-validator & Algoritmos de integridade (CPF/CNPJ)

## Funcionalidades
- **Fluxos de Cadastro:** Suporte a Pessoa Jurídica, Física e Estrangeira.
- **Validações de Segurança:** Verificação de integridade de documentos e bloqueio de arquivos duplicados/inválidos.
- **Módulo Administrativo:** Aprovação automática para internos e sistema de pendências para externos.
- **Dashboard:** Endpoint de estatísticas em tempo real para tomada de decisão.

##  Como Rodar
1. Instale as dependências:
   ```bash
   npm install

2. Rode o Serviço:
   ```bash
   npm run start:dev

## Arquitetura e Design Patterns
O projeto foi estruturado seguindo princípios de **Clean Architecture** e **SOLID**:
- **Domain-Driven Design (Simpificado):** Separação clara entre Entidades, DTOs e Regras de Negócio.
- **Validators Camada Única:** Lógica matemática de CPF/CNPJ isolada em utilitários para facilitar testes unitários.
- **Custom Decorators:** Implementação de `@UserType()` para desacoplar a lógica de perfil de usuário dos controladores.
- **Segurança:** Sanitização de inputs, limites de upload (5MB) e filtros de extensão de arquivos.

## Variáveis de Ambiente (.env)
Crie um arquivo `.env` na raiz do projeto com as seguintes chaves:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=portal_st
PORT=3000