"use client";

import clsx from "clsx";

interface TabOption {
  label: string;
  value: string;
}

export default function SubHeaderTabs({
  tabs,
  activeTab,
  setActiveTab,
}: {
  tabs: TabOption[];
  activeTab: string;
  setActiveTab: (val: string) => void;
}) {
  return (
    <div className="flex justify-around w-full border-b border-gray-300">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={clsx(
            "py-3 font-semibold text-gray-700",
            activeTab === tab.value && "text-black border-b-2 border-[#e31d1a]"
          )}
          onClick={() => setActiveTab(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
