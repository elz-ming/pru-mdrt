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
      {/* Custom header with back button */}
      <header className="flex items-center gap-2 mb-4">
        <button onClick={() => router.back()}>
          <ArrowLeft size={40} />
        </button>
        <h1 className="text-xl font-bold">Search</h1>
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
