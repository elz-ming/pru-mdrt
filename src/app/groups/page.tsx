"use client";

import { useState } from "react";
import SubHeaderTabs from "@/app/components/SubHeaderTabs";
import GroupClubs from "./subcomponents/GroupClubs";
import GroupChallenges from "./subcomponents/GroupChallenges";

export default function GroupsPage() {
  const [activeTab, setActiveTab] = useState("clubs");

  const tabs = [
    { label: "Clubs", value: "clubs" },
    { label: "Challenges", value: "challenges" },
  ];

  return (
    <>
      <SubHeaderTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <main className="mt-12">
        {activeTab === "clubs" && <GroupClubs />}
        {activeTab === "challenges" && <GroupChallenges />}
      </main>
    </>
  );
}
