"use client";

import { useState, useEffect, Suspense } from "react";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import dynamic from "next/dynamic";

import ToDoList from "@/app/subcomponents/ToDoList"; // You'll create this
import ActivityFeed from "@/app/subcomponents/ActivityFeed"; // You'll create this
import AddPostButton from "@/app/subcomponents/AddPostButton"; // You'll create this
import LottieIntro from "@/app/subcomponents/LottieIntro";

function HomePage() {
  const [groupId, setGroupId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showIntro, setShowIntro] = useState(false);
  const launchParams = useLaunchParams();

  // localStorage.setItem("encoded_id", "NjYzODczODU0MA==");

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

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem("hasSeenIntro");

    if (!hasSeenIntro) {
      setShowIntro(true);
      localStorage.setItem("hasSeenIntro", "true"); // Set flag
    }
  }, []);

  if (isLoading) return <div className="p-4">Loading MDRT App...</div>;

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  if (!groupId) return <div className="p-4">No valid group ID found.</div>;

  if (showIntro) {
    return <LottieIntro onFinish={() => setShowIntro(false)} />;
  }

  return (
    <>
      {/* To-Do Section */}
      <ToDoList />

      {/* Activity Feed */}
      <div className="pt-24">
        <ActivityFeed />
      </div>

      {/* Add Post Button */}
      <AddPostButton />
    </>
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
