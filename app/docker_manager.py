# https://docker-py.readthedocs.io/en/stable/containers.html
import docker

class DockerManager:
    def __init__(self):
        self.dockerClient = docker.DockerClient()

    def getContainers(self):
        containers = self.dockerClient.containers.list(all=True)

        container_data = []
        for container in containers:
            data = {
                "name": f"{container.name}",
                "id": f"{container.id}",
                "image": f"{container.image}",
                "short_id": f"{container.short_id}",
                "status": f"{container.status}"
            }

            container_data.append(data)

        return container_data

    def find_container_from_name(self, name):
        containers = self.dockerClient.containers.list(all=True)

        container = next(
            (container for container in containers if container.name == name),
            None
        )

        return container

    def stop_container(self, container_name):
        container = self.find_container_from_name(container_name)
        if container == None:
            return 1

        container.stop()
        return 0

    def start_container(self, container_name):
        container = self.find_container_from_name(container_name)
        if container == None:
            return 1

        container.start()
        return 0

    def restart_container(self, container_name):
        container = self.find_container_from_name(container_name)
        if container == None:
            return 1

        container.restart()
        return 0
