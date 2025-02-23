from fastapi import FastAPI, HTTPException, WebSocket
from pydantic import BaseModel
import jwt
import bcrypt
import sqlite3

app = FastAPI()
SECRET_KEY = "secret"

class User(BaseModel):
    email: str
    password: str

@app.post("/register")
def register(user: User):
    hashed_pw = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt())
    conn = sqlite3.connect("database.db")
    cur = conn.cursor()
    cur.execute("INSERT INTO users (email, password) VALUES (?, ?)", (user.email, hashed_pw))
    conn.commit()
    return {"message": "User registered"}

@app.post("/login")
def login(user: User):
    conn = sqlite3.connect("database.db")
    cur = conn.cursor()
    cur.execute("SELECT password FROM users WHERE email = ?", (user.email,))
    db_user = cur.fetchone()
    if not db_user or not bcrypt.checkpw(user.password.encode(), db_user[0]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = jwt.encode({"email": user.email}, SECRET_KEY)
    return {"token": token}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message received: {data}")
