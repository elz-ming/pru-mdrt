"use client";

import { usePathname, useRouter } from "next/navigation";
import { Users, Home, Notebook } from "lucide-react";

export default function FooterBar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 w-full h-16 bg-white border-t border-gray-200 flex justify-center py-2 z-50">
      <button
        onClick={() => router.push("/groups")}
        className="flex flex-col items-center flex-1"
      >
        <Users size={40} color={isActive("/groups") ? "#e31d1a" : "#999"} />
        <span className="text-xs">Groups</span>
      </button>

      <button
        onClick={() => router.push("/")}
        className="flex flex-col items-center flex-1"
      >
        <Home size={40} color={isActive("/") ? "#e31d1a" : "#999"} />
        <span className="text-xs">Home</span>
      </button>

      <button
        onClick={() => router.push("/todolist")}
        className="flex flex-col items-center flex-1"
      >
        <Notebook
          size={40}
          color={isActive("/todolist") ? "#e31d1a" : "#999"}
        />
        <span className="text-xs ">To-Do List</span>
      </button>
    </nav>
  );
}
