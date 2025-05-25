"use client";

export default function YouPage() {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Your Journey</h2>
      <p className="text-sm text-gray-600 mb-4">
        Personal progress and milestone tracker.
      </p>

      <section className="mb-4 bg-gray-100 p-4 rounded">
        <p className="text-sm">Level: 3</p>
        <p className="text-sm">XP: 1,450 / 2,000</p>
        <p className="text-sm">Rank: Silver</p>
      </section>

      <section>
        <h3 className="text-sm font-medium mb-2">Badges</h3>
        <div className="flex gap-2">
          <span className="text-sm bg-yellow-200 px-2 py-1 rounded">
            🎖️ Consistency
          </span>
          <span className="text-sm bg-green-200 px-2 py-1 rounded">
            💬 Client Whisperer
          </span>
        </div>
      </section>
    </div>
  );
}
