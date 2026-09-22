import { useEffect, useState } from "react"
import axios from 'axios';
import ProcessOptions from "./ProcessOptions";
import LoadingState from "./LoadingState";

function PM2Dash() {
    const [processes, setProcesses] = useState(null);

    async function getStatus() {
        setProcesses(null)
        const response = await axios.get("/pm2-status")
        setProcesses(response.data)
    }

    useEffect(() => {
        getStatus()
    }, [])

    return (
        <>
            {!processes ?
                <div className="card">
                    <LoadingState />
                </div>
                :
                <div className="rounded-xl border border-gray-200 bg-white p-6 gap-2 shadow-sm transition hover:shadow-md">
                    <div className="flex justify-between">
                        <h2 className="text-sm font-medium uppercase tracking-wide text-gray-500 mb-4">
                            PM2 PROCESSES
                        </h2>
                        <button onClick={() => getStatus()}>
                            <i className="bi bi-arrow-clockwise" />
                        </button>
                    </div>

                    {processes.map(process => (
                        <div className="flex flex-col gap-4 p-2">
                            <ProcessOptions
                                process={process}
                                getStatus={getStatus}
                            />
                            <hr className="border-t border-gray-200"></hr>
                        </div>
                    ))}
                </div>
            }
        </>
    )
}

export default PM2Dash