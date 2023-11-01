# o grande trabalho

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