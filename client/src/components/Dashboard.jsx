import { useState, useEffect } from "react"
import axios from 'axios'
import CPUCard from "./CPUCard"
import RAMCard from "./RAMCard"
import StorageCard from "./StorageCard"
import DockerDash from "./DockerDash"
import PM2Dash from "./PM2Dash"
import LoadingState from "./LoadingState"

function DashBoard({onLogout, serverName, authEnabled}) {
  const [dashData, setDashData] = useState(null)

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    const socket = new WebSocket(`${protocol}//${window.location.host}/ws`)

    socket.onmessage = (event) => {
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
          {authEnabled && <button onClick={() => logout()}>Logout</button>}
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

        <PM2Dash />

      </div>
      : <LoadingState />
  )
}

export default DashBoard