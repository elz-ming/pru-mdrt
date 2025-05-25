"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react"; // or any icon you prefer

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div>
      {/* Custom header with back button */}
      <header className="flex items-center gap-2 mb-4">
        <button onClick={() => router.back()}>
          <ArrowLeft size={40} />
        </button>
        <h1 className="text-xl font-bold">Settings</h1>
      </header>

      <ul className="space-y-3">
        <li className="p-3 bg-gray-100 rounded">🔔 Notification Preferences</li>
        <li className="p-3 bg-gray-100 rounded">🌙 Theme Mode (Coming Soon)</li>
      </ul>
    </div>
  );
}
