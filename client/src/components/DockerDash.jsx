import { useEffect, useState } from "react"
import axios from 'axios';
import ContainerOptions from "./ContainerOptions";
import LoadingState from "./LoadingState";

function DockerDash() {
    const [containers, setContainers] = useState(null);

    async function getStatus() {
        setContainers(null)
        const response = await axios.get("/docker-status");
        setContainers(response.data);
    }

    useEffect(() => {
        getStatus()
    }, [])

    return (
        <>
            {!containers ?
                <div className="card">
                    <LoadingState />
                </div>
                :
                <div className="rounded-xl border border-gray-200 bg-white p-6 gap-2 shadow-sm transition hover:shadow-md">
                    <div className="flex justify-between">
                        <h2 className="text-sm font-medium uppercase tracking-wide text-gray-500 mb-4">
                            CONTAINERS
                        </h2>
                        <button onClick={() => getStatus()}>
                            <i className="bi bi-arrow-clockwise" />
                        </button>
                    </div>

                    {containers.map(container => (
                        <div className="flex flex-col gap-4 p-2">
                            <ContainerOptions
                                key={container.id}
                                container={container}
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

export default DockerDash