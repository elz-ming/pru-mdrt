"use client";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Settings</h1>
      <p className="text-sm text-gray-600 mb-2">Customize your experience.</p>

      <ul className="space-y-3">
        <li className="p-3 bg-gray-100 rounded">🔔 Notification Preferences</li>
        <li className="p-3 bg-gray-100 rounded">🌙 Theme Mode (Coming Soon)</li>
        <li className="p-3 bg-gray-100 rounded text-red-500">🚪 Log Out</li>
      </ul>
    </div>
  );
}
