# Portal de Serviços ST - Backend

Este é o core administrativo do Portal de Serviços ST, desenvolvido com **NestJS**. O sistema gerencia o cadastro de empresas (Pessoa Física, Jurídica e Estrangeira), fluxos de aprovação interna, autenticação de administradores e integração de arquivos com criptografia de dados sensíveis.

## Tecnologias
- **Framework:** NestJS
- **Banco de Dados:** PostgreSQL (TypeORM)
- **Autenticação:** JWT + Passport
- **Criptografia:** AES-256-CBC para documentos + Hash SHA256 para busca
- **Documentação:** Swagger/OpenAPI
- **Validação:** Class-validator & Algoritmos de integridade (CPF/CNPJ)

## Funcionalidades Principais

### Gestão de Empresas
- **Fluxos de Cadastro:** Suporte a Pessoa Jurídica, Física e Estrangeira
- **Validações de Segurança:** Verificação de integridade de documentos e bloqueio de arquivos duplicados/inválidos
- **Criptografia de Dados:** Documentos são criptografados no banco com busca via hash
- **Consulta Pública:** Endpoint para verificação de status por documento

### Módulo Administrativo
- **Autenticação JWT:** Sistema seguro de login para administradores
- **Aprovação automática:** Para usuários internos com responsável definido
- **Sistema de pendências:** Para usuários externos com fluxo de aprovação
- **Dashboard:** Estatísticas em tempo real para tomada de decisão

### Segurança
- **Criptografia AES-256-CBC:** Para campos sensíveis (documentos)
- **Hash SHA256:** Para busca eficiente em campos criptografados
- **Senhas bcrypt:** Para autenticação segura de administradores
- **Guards JWT:** Proteção de rotas administrativas

## Estrutura do Projeto

```
src/
├── auth/                   # Sistema de autenticação
│   ├── entities/          # Entidade Admin
│   ├── dto/               # DTOs de login e criação
│   ├── guards/            # Guards JWT
│   └── strategies/        # Estratégias Passport
├── common/                # Utilitários compartilhados
│   ├── decorators/        # Decorators customizados
│   └── encryption/        # Serviços de criptografia
├── empresas/              # Módulo principal de empresas
│   ├── entities/          # Entidade Empresa
│   ├── dto/               # DTOs de criação e atualização
│   ├── enums/             # Enumerações de status e tipos
│   └── utils/             # Validadores e utilitários
└── rh/                    # Módulo RH (futuro)
```

## Como Rodar

### Pré-requisitos
- Node.js 16+
- PostgreSQL 12+
- npm ou yarn

### Instalação
1. Clone o repositório:
   ```bash
   git clone <repository-url>
   cd backend-portal-st
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

4. Execute as migrações do banco:
   ```bash
   npm run start:dev
   # O synchronize está habilitado em desenvolvimento
   ```

5. Crie o primeiro administrador:
   ```bash
   npm run create-admin
   ```

6. Acesse a aplicação:
   - **API:** http://localhost:3000
   - **Swagger:** http://localhost:3000/api

## Endpoints Principais

### Autenticação
- `POST /auth/login` - Login de administrador
- `POST /auth/admin` - Criar novo administrador
- `GET /auth/me` - Dados do usuário logado

### Empresas
- `POST /empresas` - Cadastrar nova empresa
- `GET /empresas` - Listar empresas (admin)
- `GET /empresas/status/:documento` - Consulta pública de status
- `PATCH /empresas/:id/aprovar` - Aprovar empresa (admin)
- `PATCH /empresas/:id/reprovar` - Reprovar empresa (admin)
- `GET /empresas/dashboard/stats` - Estatísticas do dashboard

## Variáveis de Ambiente (.env)

```env
# Configuração do Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=backend_portal_st
DB_SYNC=true

# Chave de Criptografia (deve ter exatamente 32 caracteres)
SECRET_KEY=sua_chave_secreta_de_32_caracteres

# JWT Secret (para autenticação)
JWT_SECRET=seu_jwt_secret_aqui_bem_seguro_123

# Outras configurações
NODE_ENV=development
PORT=3000
```

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Inicia em modo desenvolvimento
npm run start:debug        # Inicia com debug habilitado

# Build e Produção
npm run build              # Compila o projeto
npm run start:prod         # Inicia em modo produção

# Utilitários
npm run create-admin       # Cria primeiro administrador
npm run lint               # Verifica código com ESLint
npm run test               # Executa testes unitários

# Formatação
npm run format             # Formata código com Prettier
```

## Arquitetura e Design Patterns

O projeto foi estruturado seguindo princípios de **Clean Architecture** e **SOLID**:

- **Domain-Driven Design:** Separação clara entre Entidades, DTOs e Regras de Negócio
- **Validators Camada Única:** Lógica matemática de CPF/CNPJ isolada em utilitários
- **Custom Decorators:** `@UserType()` e `@User()` para desacoplar lógica de perfil
- **Guards e Strategies:** Implementação robusta de autenticação JWT
- **Transformers:** Criptografia transparente com TypeORM
- **Segurança:** Sanitização de inputs, limites de upload (5MB) e validação de arquivos

## Considerações de Segurança

### Criptografia
- Documentos são criptografados usando AES-256-CBC
- Hash SHA256 permite busca eficiente sem exposer dados
- Chaves de criptografia configuradas via variáveis de ambiente

### Autenticação
- Senhas são hasheadas com bcrypt (salt 10)
- JWT com expiração configurável (padrão: 48h)
- Guards protegem rotas administrativas

### Validações
- Validação matemática de CPF/CNPJ
- Sanitização de inputs com class-validator
- Prevenção de duplicação de arquivos
- Limites de tamanho e tipo de arquivo
