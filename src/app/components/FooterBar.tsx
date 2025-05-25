"use client";

import { usePathname, useRouter } from "next/navigation";
import { Users, Home, User } from "lucide-react";

export default function FooterBar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-center py-2 z-50">
      <button
        onClick={() => router.push("/groups")}
        className="flex flex-col items-center"
      >
        <Users size={20} color={isActive("/groups") ? "#ed202f" : "#999"} />
        <span className="text-xs">Groups</span>
      </button>
      <button
        onClick={() => router.push("/")}
        className="flex flex-col items-center"
      >
        <Home size={20} color={isActive("/") ? "#ed202f" : "#999"} />
        <span className="text-xs">Home</span>
      </button>
      <button
        onClick={() => router.push("/you")}
        className="flex flex-col items-center"
      >
        <User size={20} color={isActive("/you") ? "#ed202f" : "#999"} />
        <span className="text-xs">You</span>
      </button>
    </nav>
  );
}
