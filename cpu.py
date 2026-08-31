import psutil


class CPUInfo:
    def __init__(self):
        self.freq = psutil.cpu_freq()
        self.percent = psutil.cpu_percent(interval=None)

    def update(self):
        self.freq = psutil.cpu_freq()
        self.percent = psutil.cpu_percent(interval=None)

    def getUsage(self):
        return self.percent

    def getCurrentFrequency(self):
        return self.freq.current

    def getMinFrequency(self):
        return self.freq.min

    def getMaxFrequency(self):
        return self.freq.max
