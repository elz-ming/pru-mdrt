"use client";

import { useState, useEffect, Suspense } from "react";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import dynamic from "next/dynamic";

import ToDoList from "@/app/subcomponents/ToDoList"; // You'll create this
import ActivityFeed from "@/app/subcomponents/ActivityFeed"; // You'll create this
import AddPostButton from "@/app/subcomponents/AddPostButton"; // You'll create this

function HomePage() {
  const [groupId, setGroupId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const launchParams = useLaunchParams();

  useEffect(() => {
    const initialize = async () => {
      try {
        if (launchParams) {
          try {
            const encodedGroupId =
              launchParams.tgWebAppStartParam ??
              launchParams?.tgWebAppData?.start_param ??
              launchParams?.startapp ??
              null;

            const decodedGroupId = atob(encodedGroupId as string);
            console.log("Decoded Group ID:", decodedGroupId);

            setGroupId(decodedGroupId);

            if (typeof encodedGroupId === "string") {
              localStorage.setItem("encoded_id", encodedGroupId as string);
            }
          } catch (error) {
            console.error("Error decoding group ID:", error);
            setError("Invalid group ID format");
          }
        } else {
          console.log("No launchParams available");
          setError(`launchParams: ${JSON.stringify(launchParams)}`);
        }
      } catch (error) {
        console.error("Error in initializeComponent:", error);
        setError("An error occurred while initializing the component");
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [launchParams]);

  if (isLoading) return <div className="p-4">Loading MDRT App...</div>;

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  if (!groupId) return <div className="p-4">No valid group ID found.</div>;

  return (
    <div className="min-h-screen flex flex-col relative bg-white text-black">
      {/* Expandable To-Do Section */}
      <div
        className={`transition-all duration-300 ${
          isExpanded ? "h-1/3" : "h-12"
        } overflow-hidden border-b`}
      >
        <div className="flex justify-between items-center px-4 py-2 bg-gray-100">
          <h2 className="font-semibold text-lg">Your To-Do List</h2>
          <button
            className="text-sm underline"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? "Collapse ▲" : "Expand ▼"}
          </button>
        </div>
        {isExpanded && <ToDoList />}
      </div>

      {/* Activity Feed */}
      <div className="flex-1 overflow-auto">
        <ActivityFeed />
      </div>

      {/* Add Post Button */}
      <AddPostButton />
    </div>
  );
}

// Dynamic import to avoid SSR issues
const HomeClient = dynamic(() => Promise.resolve(HomePage), {
  ssr: false,
});

export default function Home() {
  return (
    <Suspense fallback={<div className="p-4">Loading Home Page...</div>}>
      <HomeClient />
    </Suspense>
  );
}
