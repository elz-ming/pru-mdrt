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
  fixed = true,
  inverse = false,
}: {
  tabs: TabOption[];
  activeTab: string;
  setActiveTab: (val: string) => void;
  fixed?: boolean;
  inverse?: boolean;
}) {
  return (
    <div
      className={clsx(
        "flex justify-around w-full h-12 border-b",
        inverse ? "border-gray-300 bg-white" : "border-white bg-[#e31d1a]",
        fixed ? "fixed z-50" : ""
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
