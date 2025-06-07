"use client";

import Link from "next/link";

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          You are viewing this page because you're not inside the Telegram
          WebApp.
        </p>

        <div className="grid gap-4">
          <Link
            href="/"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go Back to Home
          </Link>

          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Manage Users (Placeholder)
          </Link>

          <Link
            href="/admin/posts"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            View Posts (Placeholder)
          </Link>
        </div>
      </div>
    </main>
  );
}
