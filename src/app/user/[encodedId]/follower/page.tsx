"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "@/app/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react"; // or any icon you prefer

interface RawFollower {
  follower_id: string;
  users: {
    encoded_id: string;
    display_name: string;
    telegram_username: string;
    profile_pic_url?: string;
  }[];
}

interface Follower {
  follower_id: string;
  users: {
    encoded_id: string;
    display_name: string;
    telegram_username: string;
    profile_pic_url?: string;
  };
}

export default function FollowerPage() {
  const router = useRouter();
  const { encodedId } = useParams();
  const decodedId = decodeURIComponent(encodedId as string);
  const [users, setUsers] = useState<Follower[]>([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      const { data, error } = await supabase
        .from("follows")
        .select(
          "follower_id, users:follower_id(encoded_id, display_name, telegram_username, profile_pic_url)"
        )
        .eq("followed_id", decodedId);

      if (!error && data) {
        const parsed = (data as RawFollower[])
          .filter((item) => Array.isArray(item.users) && item.users.length > 0)
          .map((item) => ({
            follower_id: item.follower_id,
            users: item.users[0], // flatten
          }));

        setUsers(parsed);
      }
    };

    fetchFollowers();
  }, [decodedId]);

  return (
    <>
      {/* Top Row */}
      <header className="flex w-full items-center gap-4 px-4 py-3 bg-white">
        <button onClick={() => router.back()}>
          <ArrowLeft size={40} />
        </button>
        <h1 className="text-xl font-bold">Followers</h1>
      </header>

      <ul className="flex flex-col gap-3 p-4">
        {users.map((item) => {
          const user = item.users;
          return (
            <Link key={user.encoded_id} href={`/user/${user.encoded_id}`}>
              <li className="flex items-center gap-3 p-3 bg-gray-100 rounded-md hover:bg-gray-200 transition">
                <Image
                  src={user.profile_pic_url || "/default-avatar.png"}
                  alt={user.display_name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{user.display_name}</p>
                  <p className="text-sm text-gray-600">
                    @{user.telegram_username}
                  </p>
                </div>
              </li>
            </Link>
          );
        })}
      </ul>
    </>
  );
}
