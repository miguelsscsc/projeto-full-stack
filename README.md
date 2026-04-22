# Sistema Escolar Fullstack

Aplicação completa com:

- React consumindo API REST
- Node.js + Express no back-end
- Banco SQL com PostgreSQL
- Autenticação JWT
- Autorização por perfis (`admin`, `teacher`, `student`)
- CRUD completo de usuários, turmas, disciplinas e matrículas
- Relacionamentos SQL entre entidades
- Interface responsiva

## Estrutura

- `frontend`: interface React com Vite
- `backend`: API Express organizada em:
  - `models`
  - `controllers`
  - `routes`
  - `middlewares`
  - `config`
  - `utils`

## Credenciais iniciais

- Admin: `admin@school.com` / `123456`
- Professor: `teacher@school.com` / `123456`
- Aluno: `student@school.com` / `123456`

## Como executar

1. Instale as dependências:
   - `npm install --prefix backend`
   - `npm install --prefix frontend`
2. Crie um banco PostgreSQL e copie `backend/.env.example` para `backend/.env`.
3. Inicialize as tabelas e seed:
   - `npm --prefix backend run db:init`
4. Rode a API:
   - `npm run dev:backend`
5. Em outro terminal, rode o front:
   - `npm run dev:frontend`

## Funcionalidades

- Login com JWT
- Cadastro público de aluno
- Dashboard por perfil
- CRUD de usuários para administrador
- CRUD de turmas para administrador
- CRUD de disciplinas relacionando professor e turma
- CRUD de matrículas relacionando aluno e disciplina
- Professor pode atualizar notas, frequência e status das próprias disciplinas
- Aluno visualiza suas disciplinas e matrículas

## Tecnologias obrigatórias aplicadas

- Node.js + Express
- PostgreSQL
- JWT
- bcrypt
- CORS configurado
- Middlewares separados para `auth`, `roles` e `validation`
