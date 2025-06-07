"use client";

export default function YouProgress() {
  const xpPercentage = 68; // e.g., 68% to next level
  const achievements = [
    { date: "2025-03-01", label: "Joined MDRT Club" },
    { date: "2025-04-15", label: "Completed 10 Sales" },
    { date: "2025-06-01", label: "Earned 'Top Rookie'" },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Top Row: XP Bar + Badge */}
      <div className="grid grid-cols-3 gap-4">
        {/* XP Bar (2/3) */}
        <div className="col-span-2">
          <p className="font-semibold mb-1">XP Progress</p>
          <div className="w-full bg-gray-200 rounded-full h-4 relative">
            <div
              className="bg-[#e31d1a] h-4 rounded-full transition-all duration-500"
              style={{ width: `${xpPercentage}%` }}
            />
            <span className="absolute top-[-28px] right-0 text-sm font-medium text-gray-600">
              {xpPercentage}%
            </span>
          </div>
        </div>

        {/* Badge (1/3) */}
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
              🏅
            </div>
            <p className="text-sm mt-2 font-semibold text-gray-700">
              Top Rookie
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Row: Vertical Timeline */}
      <div className="relative ml-4 mt-8">
        {/* Vertical line */}
        <div className="absolute left-2 top-0 bottom-0 w-1 bg-gray-300" />

        <ul className="space-y-6">
          {achievements.map((a, idx) => (
            <li key={idx} className="relative pl-8">
              {/* Dot */}
              <div className="absolute left-[-4px] top-1 w-4 h-4 bg-[#e31d1a] rounded-full border-2 border-white shadow" />
              <p className="text-sm text-gray-700">
                <span className="font-semibold">{a.date}</span> — {a.label}
              </p>
            </li>
          ))}
        </ul>

        {/* Glowing end circle */}
        <div className="absolute left-0 bottom-0 translate-y-6">
          <div className="w-4 h-4 rounded-full bg-[#e31d1a] animate-pulse shadow-lg" />
        </div>
      </div>
    </div>
  );
}
