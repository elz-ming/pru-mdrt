"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import supabase from "@/app/lib/supabaseClient"; // ✅ Your client path

interface User {
  encoded_id: string;
  display_name: string;
  telegram_username: string;
  profile_pic_url: string | null;
}

export default function SearchFriends() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [encodedId, setEncodedId] = useState<string | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem("encoded_id");
    setEncodedId(storedId);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("encoded_id, display_name, telegram_username, profile_pic_url")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch users:", error.message);
      } else {
        console.log("✅ Fetched users:", data);
        setUsers(data);
      }

      setLoading(false);
    };

    fetchUsers();
  }, []);

  const q = query.toLowerCase();
  const filteredUsers = users.filter((user) => {
    const name = user.display_name?.toLowerCase() || "";
    const username = user.telegram_username?.toLowerCase() || "";

    const isSelf = user.encoded_id === encodedId; // 🧠 key check here
    return !isSelf && (name.includes(q) || username.includes(q));
  });

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search friends..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border rounded-md"
      />

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {filteredUsers.map((user) => (
            <Link key={user.encoded_id} href={`/user/${user.encoded_id}`}>
              <li className="flex items-center gap-3 p-3 bg-gray-100 rounded-md">
                <img
                  src={user.profile_pic_url || "/default-avatar.png"}
                  alt={user.display_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{user.display_name}</p>
                  <p className="text-sm text-gray-600">
                    @{user.telegram_username}
                  </p>
                </div>
              </li>
            </Link>
          ))}
          {filteredUsers.length === 0 && (
            <li className="text-sm text-gray-500 text-center">
              No matching users found.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
