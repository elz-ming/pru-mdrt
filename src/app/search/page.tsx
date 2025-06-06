"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react"; // or any icon you prefer
import SubHeaderTabs from "@/app/components/SubHeaderTabs";
import SearchFriends from "./subcomponents/SearchFriends";
import SearchClubs from "./subcomponents/SearchClubs";

export default function SearchPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("friends");

  const tabs = [
    { label: "Friends", value: "friends" },
    { label: "Clubs", value: "clubs" },
  ];

  return (
    <>
      <header className="bg-white">
        {/* Row 1: Back button and title */}
        <div className="flex w-full items-center gap-4 px-4 py-3">
          <button onClick={() => router.back()}>
            <ArrowLeft size={28} />
          </button>
          <h1 className="text-2xl font-bold">Search</h1>
        </div>

        {/* Row 2: Tabs */}
        <SubHeaderTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </header>

      <main>
        <div className="px-4 py-2">
          {activeTab === "friends" && <SearchFriends />}
          {activeTab === "clubs" && <SearchClubs />}
        </div>
      </main>
    </>
  );
}
