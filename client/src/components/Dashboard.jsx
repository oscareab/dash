import CPUCard from "./CPUCard"
import RAMCard from "./RAMCard"
import StorageCard from "./StorageCard"

function DashBoard({ dashData }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-2 md:grid-cols-2">

        <div className="flex flex-col gap-2">
          <CPUCard cpu={dashData.cpu} />
          <RAMCard memory={dashData.memory} />
        </div>

        <StorageCard storage={dashData.storage} />

      </div>
    </div>
  )
}

export default DashBoard