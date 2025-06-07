// app/you/subcomponents/ProgressCard.tsx
"use client";

interface ProgressCardProps {
  monthLabel: string;
  items: { date: string; label: string }[];
  color: string | null;
}

export default function ProgressCard({
  monthLabel,
  items,
  color,
}: ProgressCardProps) {
  return (
    <div className="w-full">
      <h3
        className={`w-full text-md font-bold text-white p-1 z-20 relative`}
        style={{ backgroundColor: color || "#999" }}
      >
        {monthLabel}
      </h3>

      <ul className="flex flex-col gap-2 py-2 ml-4 list-none text-sm text-gray-700">
        {items.map((item, idx) => (
          <li key={idx} className="pl-10">
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
