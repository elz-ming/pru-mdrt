"use client";

import { usePathname, useRouter } from "next/navigation";
import { Users, Home, Notebook } from "lucide-react";

export default function FooterBar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 w-full h-20 bg-white text-[#999] border-t border-gray-200 flex justify-center py-2 z-50">
      <button
        onClick={() => router.push("/groups")}
        className="flex flex-col items-center justify-between flex-1"
      >
        <Users
          size={isActive("/groups") ? 40 : 36}
          color={isActive("/groups") ? "#e31d1a" : "#999"}
        />
        <div className="h-6 flex items-center">
          <span
            className={`${
              isActive("/groups")
                ? "text-sm text-[#e31d1a] font-bold"
                : "text-xs text-[#999]"
            }`}
          >
            Groups
          </span>
        </div>
      </button>

      <button
        onClick={() => router.push("/")}
        className="flex flex-col items-center justify-between flex-1"
      >
        <Home
          size={isActive("/") ? 40 : 36}
          color={isActive("/") ? "#e31d1a" : "#999"}
        />
        <div className="h-6 flex items-center">
          <span
            className={`${
              isActive("/")
                ? "text-sm text-[#e31d1a] font-bold"
                : "text-xs text-[#999]"
            }`}
          >
            Home
          </span>
        </div>
      </button>

      <button
        onClick={() => router.push("/todolist")}
        className="flex flex-col items-center justify-between flex-1"
      >
        <Notebook
          size={isActive("/groups") ? 40 : 36}
          color={isActive("/todolist") ? "#e31d1a" : "#999"}
        />
        <div className="h-6 flex items-center">
          <span
            className={`${
              isActive("/todolist")
                ? "text-sm text-[#e31d1a] font-bold"
                : "text-xs text-[#999]"
            }`}
          >
            To-Do List
          </span>
        </div>
      </button>
    </nav>
  );
}
