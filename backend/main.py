from fastapi import FastAPI
from routes import authentication, todo_crud

app = FastAPI()
app.include_router(authentication.router)
app.include_router(todo_crud.router)


@app.get("/")
def root():
    return {"Hello": "World"}
