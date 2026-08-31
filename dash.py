
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import asyncio

from cpu import CPUInfo
from memory import MemoryInfo
from storage import StorageInfo
from docker_manager import DockerManager

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

cpuInfo = CPUInfo()
memoryInfo = MemoryInfo()
storageInfo = StorageInfo()
dockerManager = DockerManager()

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

@app.get('/hello')
async def root():
    return {"message": "Server is up!"}

@app.get('/docker-status')
async def root():
    return dockerManager.getContainers()

@app.get('/start/{name}')
async def root(name: str):
    status = dockerManager.start_container(name)
    return {
        "status": status
    }

@app.get('/stop/{name}')
async def root(name: str):
    status = dockerManager.stop_container(name)
    return {
        "status": status
    }

@app.get('/restart/{name}')
async def root(name: str):
    status = dockerManager.restart_container(name)
    return {
        "status": status
    }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    try:
        while True:
            data = create_json()
            await websocket.send_json(data)
            await asyncio.sleep(3)
    except:
        print("web socket client disconnected")

app.mount("/", StaticFiles(directory="client/dist", html = True), name="site")
