from pm2 import PM2Manager

class MyPM2Manager:
    def __init__(self):
        self.pm2 = PM2Manager()

    def get_processes(self):
        result = []
        for proc in self.pm2.list_processes():
            proc_result = {
                "name": f"{proc.name}",
                "status": f"{proc.status}"
                }
            result.append(proc_result)

        return result

    def stop_process(self, name):
        try:
            self.pm2.stop_process(name)
            return 0
        except Exception as e:
            return 1

    def start_process(self, name):
        try:
            self.pm2.start_app(name)
            return 0
        except Exception as e:
            return 1