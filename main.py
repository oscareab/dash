
from fastapi import (
    FastAPI,
    WebSocket,
    WebSocketDisconnect,
    Cookie,
    Form,
    Response,
    Depends,
    HTTPException,
)
from fastapi.staticfiles import StaticFiles
import asyncio
import secrets
import socket
import json
import bcrypt
import os
from dotenv import load_dotenv

from app.cpu import CPUInfo
from app.memory import MemoryInfo
from app.storage import StorageInfo
from app.docker_manager import DockerManager

cpu_info = CPUInfo()
memory_info = MemoryInfo()
storage_info = StorageInfo()
docker_manager = DockerManager()

with open("users.json", "r") as f:
    users = json.load(f)["users"]

load_dotenv()

SECURE_COOKIES = os.getenv("SECURE_COOKIES", "false").lower() == "true"

sessions = {}

app = FastAPI()

def update():
    cpu_info.update()
    memory_info.update()
    storage_info.update()

def create_json():
    update()
    return {
        "cpu": {
            "percent": f"{cpu_info.getUsage()}",
            "current": f"{cpu_info.getCurrentFrequency()}",
            "min": f"{cpu_info.getMinFrequency()}",
            "max": f"{cpu_info.getMaxFrequency()}"
        },
        "memory": {
            "used": f"{memory_info.getUsedRam()}",
            "max": f"{memory_info.getTotalRam()}",
            "percent": f"{memory_info.getUsedPercent()}"
        },
        "storage": {
            "partitions": storage_info.partitions
        }
    }

def validate_session(session_id):
    if not session_id:
        return None

    username = sessions.get(session_id)

    if username not in users:
        sessions.pop(session_id, None)
        return None

    return username


def get_current_user(
    session: str | None = Cookie(default=None),
):
    username = validate_session(session)

    if username is None:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated",
        )

    return username


@app.post("/login")
async def login(
    response: Response,
    username: str = Form(...),
    password: str = Form(...),
):
    user = users.get(username)

    if user is None or not bcrypt.checkpw(
        password.encode("utf-8"),
        user["password_hash"].encode("utf-8"),
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password",
        )

    session_id = secrets.token_urlsafe(32)

    sessions[session_id] = username

    response.set_cookie(
        key="session",
        value=session_id,
        httponly=True,
        secure=SECURE_COOKIES,
        samesite="strict",
    )

    return {"message": "Logged in"}



@app.post("/logout")
async def logout(
    response: Response,
    session: str | None = Cookie(default=None),
):
    if session is not None:
        sessions.pop(session, None)

    response.delete_cookie(
        key="session",
        httponly=True,
        secure=SECURE_COOKIES,
        samesite="strict",
    )

    return {"message": "Logged out"}

@app.get('/hello')
async def say_hello(
    username: str = Depends(get_current_user),
):
    return {"message": "Server is up!"}

@app.get('/name')
async def get_name():
    return {"name": f"{socket.gethostname()}"}

@app.get('/docker-status')
async def get_docker_status(
    username: str = Depends(get_current_user),
):
    return docker_manager.getContainers()

@app.post('/start/{name}')
async def start_container(
    name: str,
    username: str = Depends(get_current_user),
):
    status = docker_manager.start_container(name)
    return {
        "status": status
    }

@app.post('/stop/{name}')
async def stop_container(
    name: str, 
    username: str = Depends(get_current_user),
):
    status = docker_manager.stop_container(name)
    return {
        "status": status
    }

@app.post('/restart/{name}')
async def restart_container(
    name: str,
    username: str = Depends(get_current_user),
):
    status = docker_manager.restart_container(name)
    return {
        "status": status
    }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    session_id = websocket.cookies.get("session")

    if validate_session(session_id) is None:
        await websocket.close(code=1008)
        return

    await websocket.accept()

    try:
        while True:
            data = create_json()
            await websocket.send_json(data)
            await asyncio.sleep(3)

    except WebSocketDisconnect:
        print("WebSocket client disconnected")


app.mount("/", StaticFiles(directory="client/dist", html = True), name="site")
