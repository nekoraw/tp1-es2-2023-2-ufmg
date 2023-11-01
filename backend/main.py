from fastapi import FastAPI
from routes import authentications

app = FastAPI()
app.include_router(authentications.router)

@app.get("/")
def root():
    return {"Hello": "World"}
