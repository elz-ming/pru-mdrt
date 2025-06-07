"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import { useLaunchParams, RetrieveLPResult } from "@telegram-apps/sdk-react";
import ToDoList from "@/app/subcomponents/ToDoList";
import ActivityFeed from "@/app/subcomponents/ActivityFeed";
import AddPostButton from "@/app/subcomponents/AddPostButton";
import LottieIntro from "@/app/subcomponents/LottieIntro";

function HomePage() {
  const router = useRouter();
  const [groupId, setGroupId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showIntro, setShowIntro] = useState(false);

  let launchParams: RetrieveLPResult;
  try {
    launchParams = useLaunchParams(); // this throws the error
  } catch (err) {
    console.warn("Failed to get Telegram launch params", err);
    router.replace("/admin");
  }

  useEffect(() => {
    let encodedGroupId: string | null = null;
    if (launchParams) {
      encodedGroupId = (launchParams.tgWebAppStartParam ??
        launchParams?.tgWebAppData?.start_param ??
        launchParams?.startapp ??
        null) as string;
    } else {
      encodedGroupId = "NjYzODczODU0MA==";
    }

    if (encodedGroupId) {
      localStorage.removeItem("encoded_id");
      localStorage.removeItem("encoded_id_ready");
      localStorage.removeItem("hasSeenIntro");

      localStorage.setItem("encoded_id", encodedGroupId as string);
      localStorage.setItem("encoded_id_ready", "true");

      const decoded = atob(encodedGroupId as string);
      setGroupId(decoded);
    } else {
      setError("Missing group ID");
    }

    setIsLoading(false);
  }, [launchParams]);

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem("hasSeenIntro");

    if (!hasSeenIntro) {
      setShowIntro(true);
      localStorage.setItem("hasSeenIntro", "true");
    }
  }, []);

  if (isLoading) return <div className="p-4">Loading MDRT App...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!groupId) return <div className="p-4">No valid group ID found.</div>;
  if (showIntro) return <LottieIntro onFinish={() => setShowIntro(false)} />;

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
