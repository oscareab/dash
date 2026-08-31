
function StorageCard({ storage }) {

  return (
    <div className="card flex flex-col justify-stretch">
      <h2>STORAGE</h2>

      <div className="gap-2 flex flex-col">
        {storage.partitions.map(
          (partition) =>
            <div
              key={partition.device}
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-800">
                  {partition.device}
                </p>

                <p className="text-sm text-gray-500">
                  {partition.used} / {partition.total}
                </p>
              </div>
            </div>
        )}
      </div>
    </div>
  );
}

export default StorageCard;
