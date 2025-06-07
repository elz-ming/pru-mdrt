"use client";

import { useState } from "react";
import SubHeaderTabs from "@/app/components/SubHeaderTabs";
import YouProgress from "./subcomponents/YouProgress";
import YouAchievements from "./subcomponents/YouAchievements";

export default function YouPage() {
  const [activeTab, setActiveTab] = useState("progress");

  const tabs = [
    { label: "Progress", value: "progress" },
    { label: "Achievements", value: "achievements" },
  ];

  return (
    <>
      <SubHeaderTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <main className="mt-12">
        {activeTab === "progress" && <YouProgress />}
        {activeTab === "achievements" && <YouAchievements />}
      </main>
    </>
  );
}
