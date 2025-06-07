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
  inverse = false,
}: {
  tabs: TabOption[];
  activeTab: string;
  setActiveTab: (val: string) => void;
  inverse?: boolean;
}) {
  return (
    <div
      className={clsx(
        "fixed flex justify-around w-full h-12 border-b z-50",
        inverse ? "border-gray-300 bg-white" : "border-white bg-[#e31d1a]"
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={clsx(
            "py-3 font-semibold",
            inverse ? "text-gray-700" : "text-white",
            activeTab === tab.value &&
              (inverse
                ? "text-black border-b-2 border-[#e31d1a]"
                : "text-[#e31d1a] border-b-2 border-white")
          )}
          onClick={() => setActiveTab(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
