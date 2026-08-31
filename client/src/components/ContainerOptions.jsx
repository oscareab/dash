import { useState } from "react";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";

function ContainerOptions({ container, getStatus }) {
    const [loading, setLoading] = useState(false);
    async function start(name) {
        setLoading(true)
        const response = await axios.get(`http://100.78.61.106:8000/start/${name}`)
        if (response.data.status == 0) {
            getStatus()
        }
        setLoading(false)
    }

    async function stop(name) {
        setLoading(true)
        const response = await axios.get(`http://100.78.61.106:8000/stop/${name}`)
        if (response.data.status == 0) {
            getStatus()
        }
        setLoading(false)
    }

    async function restart(name) {
        setLoading(true)
        const response = await axios.get(`http://100.78.61.106:8000/restart/${name}`)
        if (response.data.status == 0) {
            getStatus()
        }
        setLoading(false)
    }
    return (
        <div>
            <div>
                <h2 className="text-xl font-semibold text-gray-800">
                    {container.name}
                    <span className="ml-2 text-sm font-normal text-gray-400">
                        ({container.short_id})
                    </span>
                </h2>

                <p className="text-sm text-gray-600">
                    Status:{" "}
                    <span
                        className={
                            container.status === "running"
                                ? "font-medium text-green-600"
                                : "font-medium text-gray-500"
                        }
                    >
                        {container.status}
                    </span>
                </p>
            </div>

            <div className="flex items-center gap-2">
                <button
                    disabled={container.status === "running" || loading}
                    onClick={() => start(container.name)}
                    className="bg-green-600 hover:bg-green-700"
                    title="Start"
                >
                    <i className="bi bi-play-fill" />
                </button>

                <button
                    disabled={container.status === "exited" || loading}
                    onClick={() => stop(container.name)}
                    className="bg-red-600 hover:bg-red-700"
                    title="Stop"
                >
                    <i className="bi bi-stop-fill" />
                </button>

                <button
                    disabled={container.status === "exited" || loading}
                    onClick={() => restart(container.name)}
                    className="bg-blue-600 hover:bg-blue-700"
                    title="Restart"
                >
                    <i className="bi bi-arrow-clockwise" />
                </button>

                {loading && (
                    <div className="ml-2 h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
                )}
            </div>
        </div>

    )
}

export default ContainerOptions;