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

class StorageInfo:
    def __init__(self):
        self.partitions = []

        for partition in psutil.disk_partitions():
            try:
                usage = psutil.disk_usage(partition.mountpoint)
            except (PermissionError, FileNotFoundError, OSError):
                continue
            
            partitionData = {
                "device": partition.device,
                "mountpoint": partition.mountpoint,
                "filesystem": partition.fstype,
                "total": bytes_to_human(usage.total),
                "used": bytes_to_human(usage.used),
                "free": bytes_to_human(usage.free),
                "percent": usage.percent
            }

            self.partitions.append(partitionData)

    def update(self):
        self.partitions = []

        for partition in psutil.disk_partitions():
            try:
                usage = psutil.disk_usage(partition.mountpoint)
            except (PermissionError, FileNotFoundError, OSError):
                continue
            
            partitionData = {
                "device": partition.device,
                "mountpoint": partition.mountpoint,
                "filesystem": partition.fstype,
                "total": bytes_to_human(usage.total),
                "used": bytes_to_human(usage.used),
                "free": bytes_to_human(usage.free),
                "percent": usage.percent
            }

            self.partitions.append(partitionData)
