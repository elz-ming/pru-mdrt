"use client";

import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";

export default function HeaderBar({ title }: { title: string }) {
  const router = useRouter();

  return (
    <header className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-[#e31d1a] text-white">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <button onClick={() => router.push("/settings")}>
        <Settings size={40} />
      </button>
    </header>
  );
}
