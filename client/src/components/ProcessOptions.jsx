import { useState } from "react";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";

function ProcessOptions({ process, getStatus }) {
    const [loading, setLoading] = useState(false);
    
    async function start(name) {
        setLoading(true)
        const response = await axios.post(`/start-pm2/${name}`)
        if (response.data.status == 0) {
            getStatus()
        }
        setLoading(false)
    }

    async function stop(name) {
        setLoading(true)
        const response = await axios.post(`/stop-pm2/${name}`)
        if (response.data.status == 0) {
            getStatus()
        }
        setLoading(false)
    }

    return (
        <div>
            <div>
                <h2 className="text-xl font-semibold text-gray-800">
                    {process.name}
                </h2>

                <p className="text-sm text-gray-600">
                    Status:{" "}
                    <span
                        className={
                            process.status === "ProcessStatus.ONLINE"
                                ? "font-medium text-green-600"
                                : "font-medium text-gray-500"
                        }
                    >
                        {process.status == "ProcessStatus.ONLINE" ? "online" : "offline"}
                    </span>
                </p>
            </div>

            <div className="flex items-center gap-2">
                <button
                    disabled={process.status === "ProcessStatus.ONLINE" || loading}
                    onClick={() => start(process.name)}
                    className="bg-green-600 hover:bg-green-700"
                    title="Start"
                >
                    <i className="bi bi-play-fill" />
                </button>

                <button
                    disabled={process.status === "ProcessStatus.STOPPED" || loading}
                    onClick={() => stop(process.name)}
                    className="bg-red-600 hover:bg-red-700"
                    title="Stop"
                >
                    <i className="bi bi-stop-fill" />
                </button>

                {loading && (
                    <div className="ml-2 h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
                )}
            </div>
        </div>

    )
}

export default ProcessOptions;