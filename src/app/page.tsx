"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import supabase from "./lib/supabaseClient";

import { useLaunchParams } from "@telegram-apps/sdk-react";
import ActivityFeed from "@/app/subcomponents/ActivityFeed";
import AddPostButton from "@/app/subcomponents/AddPostButton";
import Intro from "@/app/subcomponents/Intro";

function HomePage() {
  const [groupId, setGroupId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showIntro, setShowIntro] = useState(false);
  const launchParams = useLaunchParams();
  // const launchParams = "NjYzODczODU0MA==";

  if (showIntro) return <Intro onFinish={() => setShowIntro(false)} />;

  // useEffect(() => {
  //   const hasSeenIntro = localStorage.getItem("hasSeenIntro");

  //   if (!hasSeenIntro) {
  //     setShowIntro(true);
  //     localStorage.setItem("hasSeenIntro", "true");
  //   }
  // }, []);

  useEffect(() => {
    const initialize = async () => {
      try {
        if (launchParams) {
          const encodedGroupId =
            launchParams.tgWebAppStartParam ??
            launchParams?.tgWebAppData?.start_param ??
            launchParams?.startapp ??
            null;

          // const encodedGroupId = launchParams;

          if (encodedGroupId) {
            // ✅ Clear only your app's localStorage keys
            localStorage.removeItem("encoded_id");
            localStorage.removeItem("encoded_id_ready");
            localStorage.removeItem("display_name");
            localStorage.removeItem("profile_pic_url");
            // localStorage.removeItem("hasSeenIntro");

            // ✅ Store fresh encoded ID
            localStorage.setItem("encoded_id", encodedGroupId as string);
            localStorage.setItem("encoded_id_ready", "true");

            const decodedGroupId = atob(encodedGroupId as string);
            setGroupId(decodedGroupId);

            // 🔍 Query Supabase for user profile
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("display_name, profile_pic_url")
              .eq("encoded_id", encodedGroupId)
              .single();

            if (userError) {
              console.error("User fetch error:", userError.message);
            } else if (userData) {
              localStorage.setItem("display_name", userData.display_name);
              localStorage.setItem(
                "profile_pic_url",
                userData.profile_pic_url ?? "/default-avatar.png"
              );
            }
          } else {
            setError("Missing group ID");
          }
        } else {
          setError(`launchParams missing: ${JSON.stringify(launchParams)}`);
        }
      } catch (err) {
        console.error("Error in initializeComponent:", err);
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
  if (showIntro) return <Intro onFinish={() => setShowIntro(false)} />;

  return (
    <>
      {/* Activity Feed */}
      <ActivityFeed />

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
