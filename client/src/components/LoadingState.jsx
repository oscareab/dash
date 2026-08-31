import { useState } from "react";

function LoadingState() {
  const [time, setTime] = useState(0);

  setInterval(() => {
    setTime(time + 1)
  }, 1000)

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
      <p>{time} seconds elapsed</p>
    </div>
  );
}

export default LoadingState