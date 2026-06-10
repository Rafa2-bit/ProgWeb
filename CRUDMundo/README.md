# GeoMundo — Backend

API REST em TypeScript + Express + Prisma + PostgreSQL.

## Pré-requisitos

- Node.js 18+
- PostgreSQL rodando localmente

## Como rodar

### 1. Configure o banco

Crie um banco no PostgreSQL:
```sql
CREATE DATABASE geomundo;
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com sua connection string:
```
DATABASE_URL="postgresql://postgres:suasenha@localhost:5432/geomundo"
```

### 3. Instale as dependências

Na pasta app/backend:

```bash
npm install
```

### 4. Rode as migrations e o seed

```bash
npm run prisma:migrate  
npm run prisma:seed      
```

### 5. Inicie o servidor

```bash
npm run dev  
npm start    
```

Servidor sobe em: **http://localhost:3333**

### 6. Configurando o frontend

Na Pasta app/frontend:

```bash 
npm install
npm run dev
```

Acesse: **http://localhost:5173**