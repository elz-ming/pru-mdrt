"use client";

import { useRouter } from "next/navigation";
import { Settings, Search } from "lucide-react";

export default function HeaderBar({ title }: { title: string }) {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 w-full h-16 z-50 flex justify-between items-center px-4 py-3 bg-[#e31d1a] text-white">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="flex items-center gap-4">
        <button onClick={() => router.push("/search")}>
          <Search size={28} />
        </button>
        <button onClick={() => router.push("/settings")}>
          <Settings size={28} />
        </button>
      </div>
    </header>
  );
}
