"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react"; // or any icon you prefer
import supabase from "@/app/lib/supabaseClient";

type User = {
  display_name: string;
  telegram_username: string;
  profile_pic_url?: string;
};

export default function UserProfile() {
  const router = useRouter();
  const { encodedId } = useParams();
  const decodedId = decodeURIComponent(encodedId as string);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const encodedSelfId =
    typeof window !== "undefined" ? localStorage.getItem("encoded_id") : null;

  useEffect(() => {
    const fetchUser = async () => {
      if (!decodedId || !encodedSelfId) return;

      const [userRes, followStatusRes, followerCountRes, followingCountRes] =
        await Promise.all([
          supabase
            .from("users")
            .select("display_name, telegram_username, profile_pic_url")
            .eq("encoded_id", decodedId)
            .maybeSingle(),

          supabase
            .from("follows")
            .select("*")
            .eq("follower_id", encodedSelfId)
            .eq("followed_id", decodedId)
            .maybeSingle(),

          supabase
            .from("follows")
            .select("*", { count: "exact", head: true })
            .eq("followed_id", decodedId),

          supabase
            .from("follows")
            .select("*", { count: "exact", head: true })
            .eq("follower_id", decodedId),
        ]);

      setUser(userRes.data);
      setIsFollowing(!!followStatusRes.data);
      setFollowerCount(followerCountRes.count || 0);
      setFollowingCount(followingCountRes.count || 0);
      setLoading(false);
    };

    fetchUser();
  }, [decodedId, encodedSelfId]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!user) return <div className="p-4 text-red-500">User not found</div>;

  const imageSrc =
    user.profile_pic_url && user.profile_pic_url.trim() !== ""
      ? user.profile_pic_url
      : "/default-avatar.png";

  const handleFollowToggle = async () => {
    if (!encodedSelfId) return;

    if (isFollowing) {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", encodedSelfId)
        .eq("followed_id", decodedId);
      setIsFollowing(false);
      setFollowerCount((prev) => prev - 1);
    } else {
      await supabase.from("follows").insert({
        follower_id: encodedSelfId,
        followed_id: decodedId,
      });
      setIsFollowing(true);
      setFollowerCount((prev) => prev + 1);
    }
  };

  return (
    <>
      {/* Top Row */}
      <header className="flex w-full items-center gap-4 px-4 py-3 bg-white">
        <button onClick={() => router.back()}>
          <ArrowLeft size={40} />
        </button>
      </header>

      {/* Profile */}
      <div className="flex flex-col w-full bg-white gap-4 py-4">
        <div className="flex items-center gap-4 px-4">
          <Image
            src={imageSrc}
            alt={user.display_name}
            width={72}
            height={72}
            className="rounded-full object-cover"
            priority
          />
          <h1 className="text-2xl font-bold">{user.display_name}</h1>
        </div>

        {/* Followers / Following */}
        <div className="flex gap-4 px-4">
          <div className="text-start">
            <p className="text-sm text-gray-500">Following</p>
            <p className="text-lg font-semibold">{followingCount}</p>
          </div>
          <div className="text-start">
            <p className="text-sm text-gray-500">Followers</p>
            <p className="text-lg font-semibold">{followerCount}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-start gap-4 px-4">
          <button
            onClick={handleFollowToggle}
            className={`border px-4 py-1 rounded-full text-sm transition-colors duration-200${
              isFollowing
                ? "border-[#e31d1a] bg-[#e31d1a] text-white"
                : "border-[#e31d1a] text-[#e31d1a] bg-white"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>
      </div>
    </>
  );
}
