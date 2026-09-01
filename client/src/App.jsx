import { useState, useEffect } from 'react'

import DashBoard from './components/Dashboard'
import LoadingState from './components/LoadingState'
import DockerDash from './components/DockerDash'

function App() {
  const [lastReceived, setLastReceived] = useState(null)

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    const socket = new WebSocket(`${protocol}//${window.location.host}/ws`)

    socket.onmessage = (event) => {
      // console.log(event.data)
      let obj = JSON.parse(event.data)
      setLastReceived(obj)
    }

    return () => {
      socket.close()
    }
  }, [])

  return (
    lastReceived ?
      <div className='flex flex-col gap-2 p-8 md:max-w-2/3 md:mx-auto'>
        <h1>LUDOVICO</h1>
        <DashBoard dashData={lastReceived} />
        <DockerDash />
      </div>
      : <LoadingState />
  )

}

export default App
