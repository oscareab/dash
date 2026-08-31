
function RAMCard({ memory }) {
  return (
    <div className="card">
      <h2 className="">
        RAM
      </h2>

      <div className="flex gap-2">
        <p className="mt-2 text-2xl font-bold text-gray-900">{memory.used}
          <span> / </span>
          {memory.max}</p>

        <p className="mt-2 text-sm text-gray-500">
          {memory.percent}% 
        </p>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{
            width: `${Math.min(memory.percent, 100)}%`,
          }}
        />
      </div>
    </div>
  )
}

export default RAMCard;