#  tp1-es2-2023-2-ufmg

## Membros do Grupo

- Michel Barros (2020006906)

## Sobre o Sistema

O Sistema é uma lista de tarefas CRUD com autenticação de usuários que consiste em duas partes: o backend e o frontend. O backend em FastAPI é responsável pela manipulação de dados solicitada pela interface, como registro de usuários, login e gerenciamento de sessão com o MongoDB. Já o front-end em SolidJS é responsável pela interação e experiência do usuário. 

O MongoDB é um banco de dados não relacional, que é caracterizado pelo armazenamento dos dados em coleções e documentos com a estrutura flexível.
O FastAPI é um web framework que auxilia na criação de API's REST.
O SolidJS é uma biblioteca que facilita a criação de sites interativos, responsivos e flexíveis.

## para rodar

### frontend

```bash
cd frontend

# pnpm ou oq vc usar
pnpm i
pnpm run dev
```

### backend

```bash
cd backend
python3 -m venv env
source env/bin/activate
python3 -m pip install -r requirements.txt
uvicorn main:app
```