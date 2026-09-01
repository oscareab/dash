
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
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import asyncio
import secrets
import socket

import sys
sys.path.append('modules')

from cpu import CPUInfo
from memory import MemoryInfo
from storage import StorageInfo
from docker_manager import DockerManager

cpuInfo = CPUInfo()
memoryInfo = MemoryInfo()
storageInfo = StorageInfo()
dockerManager = DockerManager()

USERNAME = 'oscar'
PASSWORD ='password'

sessions = {}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=False,
)

def update():
    cpuInfo.update()
    memoryInfo.update()
    storageInfo.update()

def create_json():
    update()
    return {
        "cpu": {
            "percent": f"{cpuInfo.getUsage()}",
            "current": f"{cpuInfo.getCurrentFrequency()}",
            "min": f"{cpuInfo.getMinFrequency()}",
            "max": f"{cpuInfo.getMaxFrequency()}"
        },
        "memory": {
            "used": f"{memoryInfo.getUsedRam()}",
            "max": f"{memoryInfo.getTotalRam()}",
            "percent": f"{memoryInfo.getUsedPercent()}"
        },
        "storage": {
            "partitions": storageInfo.partitions
        }
    }

def get_current_user(
    session: str | None = Cookie(default=None),
):
    if not session:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated",
        )

    username = sessions.get(session)

    if username is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid session",
        )

    return username

@app.post("/login")
async def login(
    response: Response,
    username: str = Form(...),
    password: str = Form(...),
):
    username_ok = secrets.compare_digest(username, USERNAME)
    password_ok = secrets.compare_digest(password, PASSWORD)

    if not (username_ok and password_ok):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password",
        )

    if username in sessions:
        raise HTTPException(
            status_code=409,
            detail="User is already logged in",
        )

    session_id = secrets.token_urlsafe(32)

    sessions[session_id] = username

    response.set_cookie(
        key="session",
        value=session_id,
        httponly=True,
        secure=False,
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
        secure=False,
        samesite="strict",
    )

    return {"message": "Logged out"}

@app.get('/hello')
async def root(
    username: str = Depends(get_current_user),
):
    return {"message": "Server is up!"}

@app.get('/name')
async def root():
    return {"name": f"{socket.gethostname()}"}

@app.get('/docker-status')
async def root(
    username: str = Depends(get_current_user),
):
    return dockerManager.getContainers()

@app.post('/start/{name}')
async def root(
    name: str,
    username: str = Depends(get_current_user),
):
    status = dockerManager.start_container(name)
    return {
        "status": status
    }

@app.post('/stop/{name}')
async def root(
    name: str, 
    username: str = Depends(get_current_user),
):
    status = dockerManager.stop_container(name)
    return {
        "status": status
    }

@app.post('/restart/{name}')
async def root(
    name: str,
    username: str = Depends(get_current_user),
):
    status = dockerManager.restart_container(name)
    return {
        "status": status
    }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    session_id = websocket.cookies.get("session")

    if not session_id:
        await websocket.close(code=1008)
        return

    username = sessions.get(session_id)

    if username is None:
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
