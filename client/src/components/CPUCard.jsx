
function CPUCard({cpu}) {
    return (
        <div className="card">
          <h2>
            CPU
          </h2>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {cpu.percent}%
          </p>

          <div className="mt-3 h-2 rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{
                width: `${Math.min(cpu.percent, 100)}%`,
              }}
            />
          </div>
        </div>
    )
}

export default CPUCard;