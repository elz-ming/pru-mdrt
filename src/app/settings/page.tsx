"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react"; // or any icon you prefer

export default function SettingsPage() {
  const router = useRouter();

  return (
    <>
      {/* Custom header with back button */}
      <header className="flex w-full items-center gap-4 px-4 py-3 bg-white">
        <button onClick={() => router.back()}>
          <ArrowLeft size={40} />
        </button>
        <h1 className="text-xl font-bold">Settings</h1>
      </header>
      <main>
        <ul className="space-y-3">
          <li className="p-3 bg-gray-100 rounded">
            🔔 Notification Preferences
          </li>
          <li className="p-3 bg-gray-100 rounded">
            🌙 Theme Mode (Coming Soon)
          </li>
        </ul>
      </main>
    </>
  );
}
