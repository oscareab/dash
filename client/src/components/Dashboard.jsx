import { useState, useEffect } from "react"
import axios from 'axios'
import CPUCard from "./CPUCard"
import RAMCard from "./RAMCard"
import StorageCard from "./StorageCard"
import DockerDash from "./DockerDash"
import LoadingState from "./LoadingState"

function DashBoard({onLogout}) {
  const [dashData, setDashData] = useState(null)
  const [serverName, setServerName] = useState(null)

  useEffect(() => {
    const fetchServerName = async () => {
      const response = await axios.get('/name');
      setServerName(response.data.name);
    };

    fetchServerName();

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    const socket = new WebSocket(`${protocol}//${window.location.host}/ws`)

    socket.onmessage = (event) => {
      // console.log(event.data)
      let obj = JSON.parse(event.data)
      setDashData(obj)
    }

    return () => {
      socket.close()
    }
  }, [])

  function logout() {
    axios.post('/logout')
    onLogout()
  }

  return (
    dashData ?
      <div className='flex flex-col gap-2 p-8 md:max-w-2/3 md:mx-auto'>
        <div className="flex justify-between">
          <h1>{serverName ?? "Server"}</h1>
          <button onClick={() => logout()}>Logout</button>
        </div>
        <div className="space-y-6">
          <div className="grid gap-2 md:grid-cols-2">

            <div className="flex flex-col gap-2">
              <CPUCard cpu={dashData.cpu} />
              <RAMCard memory={dashData.memory} />
            </div>

            <StorageCard storage={dashData.storage} />

          </div>
        </div>

        <DockerDash />

      </div>
      : <LoadingState />
  )
}

export default DashBoard