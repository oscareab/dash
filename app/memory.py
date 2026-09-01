import psutil

def bytes_to_human(value, suffix="B"):
    if value is None:
        return "N/A"
    value = float(value)
    for unit in ("", "K", "M", "G", "T", "P"):
        if abs(value) < 1024:
            return f"{value:.2f}{unit}{suffix}"
        value /= 1024
    return f"{value:.2f}EB"

class MemoryInfo:
    def __init__(self):
        self.svmem = psutil.virtual_memory()

    def update(self):
        self.svmem = psutil.virtual_memory()
    
    def getTotalRam(self):
        return bytes_to_human(self.svmem.total)

    def getAvailableRam(self):
        return bytes_to_human(self.svmem.available)

    def getUsedRam(self):
        return bytes_to_human(self.svmem.used)

    def getUsedPercent(self):
        return self.svmem.percent