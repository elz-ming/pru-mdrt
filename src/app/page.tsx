"use client";

import { useState, useEffect, Suspense } from "react";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import dynamic from "next/dynamic";
import HeaderBar from "@/app/components/HeaderBar";
import FooterBar from "@/app/components/FooterBar";

// Dynamic import to avoid SSR issues
const MDRTDashboardClient = dynamic(() => Promise.resolve(MDRTDashboard), {
  ssr: false,
});

function MDRTDashboard() {
  const [groupId, setGroupId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
    <div className="min-h-screen bg-white p-4 text-black">
      <HeaderBar title="Home" />

      <main>
        <p className="text-sm text-gray-600 mb-4">User ID: {groupId}</p>

        {/* Placeholder for profile info */}
        <section className="mb-6">
          <h2 className="font-semibold text-lg mb-2">Your Progress</h2>
          <div className="rounded bg-gray-100 p-4">
            <p className="text-sm">Level: 3</p>
            <p className="text-sm">XP: 1,450 / 2,000</p>
            <p className="text-sm">Current Rank: Silver</p>
          </div>
        </section>

        {/* Placeholder for badges */}
        <section>
          <h2 className="font-semibold text-lg mb-2">Achievements</h2>
          <div className="flex gap-2">
            <span className="text-sm bg-yellow-200 px-2 py-1 rounded">
              🏅 Rookie
            </span>
            <span className="text-sm bg-blue-200 px-2 py-1 rounded">
              💼 5 Policies
            </span>
          </div>
        </section>
      </main>

      <FooterBar />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <MDRTDashboardClient />
    </Suspense>
  );
}
