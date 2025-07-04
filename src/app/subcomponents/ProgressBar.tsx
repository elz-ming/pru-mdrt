"use client";

export default function ProgressBar() {
  const currentAchievers = 1050; // Just shy of 1000 for demo
  const goal = 1500;
  const percentage = Math.min((currentAchievers / goal) * 100, 100);

  // Positions for tick marks
  const tick500 = (500 / goal) * 100;
  const tick1000 = (1000 / goal) * 100;

  return (
    <div className="flex flex-col gap-2 w-full p-4 mb-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold text-center text-[#e31d1a]">
        MDRT Counter
      </h2>

      {/* Bar container */}
      <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        {/* Filled progress */}
        <div
          className="h-full bg-gradient-to-r from-[#e31d1a] to-[#f87171] rounded-full transition-all duration-700"
          style={{ width: `${percentage}%` }}
        />

        {/* Ticks */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white"
          style={{ left: `${tick500}%` }}
        ></div>
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white"
          style={{ left: `${tick1000}%` }}
        ></div>
      </div>

      {/* Labels */}
      <div className="flex justify-between text-md font-medium text-gray-700">
        <span className="font-bold text-[#e31d1a]">0</span>
        <span className="font-bold text-[#e31d1a]">500</span>
        <span className="font-bold text-[#e31d1a]">1000</span>
        <span>1500</span>
      </div>

      {/* Current value */}
      <div className="text-xs text-gray-600 text-right font-medium">
        {currentAchievers} / {goal} achievers
      </div>
    </div>
  );
}
