"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import supabase from "@/app/lib/supabaseClient";
import { MoreHorizontal, Heart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityCardProps {
  postId: string;
  encoded_id: string;
  name: string;
  activityDescription: string;
  profilePicUrl?: string | null;
  activityPicUrl?: string | null;
  createdAt?: string; // ISO string
  initialLikedByUser?: boolean;
  initialLikeCount?: number;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  postId,
  encoded_id,
  name,
  activityDescription,
  profilePicUrl,
  activityPicUrl,
  createdAt,
  initialLikedByUser,
  initialLikeCount,
}) => {
  const [liked, setLiked] = useState(initialLikedByUser || false);
  const [likeCount, setLikeCount] = useState(initialLikeCount || 0);
  const [showOptions, setShowOptions] = useState(false);

  const encodedSelfId =
    typeof window !== "undefined" ? localStorage.getItem("encoded_id") : null;

  const toggleLike = async () => {
    if (!encodedSelfId) return;

    if (liked) {
      await supabase
        .from("likes")
        .delete()
        .eq("user_id", encodedSelfId)
        .eq("post_id", postId);
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      await supabase
        .from("likes")
        .insert({ user_id: encodedSelfId, post_id: postId });
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) {
      alert("Failed to delete post.");
      return;
    }

    // Optional: you might want to trigger a refresh or state update here
    alert("Post deleted.");
  };

  return (
    <div className="bg-white py-4 space-y-3">
      {/* Top Part: Profile + Name + Menu */}

      <div className="flex justify-between items-center px-4">
        <Link href={`/user/${encoded_id}`}>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gray-300 overflow-hidden">
              {profilePicUrl ? (
                <Image
                  src={profilePicUrl}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="object-cover rounded-full"
                />
              ) : null}
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-sm">{name}</p>
              <p className="text-xs text-gray-500">
                {createdAt
                  ? formatDistanceToNow(new Date(createdAt), {
                      addSuffix: true,
                    })
                  : ""}
              </p>
            </div>
          </div>
        </Link>
        <div className="relative text-gray-500 hover:text-gray-700">
          <button onClick={() => setShowOptions((prev) => !prev)}>
            <MoreHorizontal size={18} />
          </button>

          {showOptions && encodedSelfId === encoded_id && (
            <div className="absolute right-0 top-6 bg-white shadow-md rounded-md p-2 z-10">
              <button
                className="block text-red-500 text-sm hover:underline"
                onClick={handleDelete}
              >
                Delete
              </button>
              {/* Future: Add Edit option here */}
            </div>
          )}
        </div>
      </div>

      {/* Middle Part: Activity */}
      <div className="flex flex-col gap-2">
        <p className="px-4 text-sm text-gray-600 mt-1">{activityDescription}</p>
        {activityPicUrl && (
          <div className="overflow-hidden">
            <img
              src={activityPicUrl}
              alt="Activity"
              className="w-full max-h-96 object-cover"
            />
          </div>
        )}
      </div>

      {/* Bottom Part: Actions */}
      <div className="flex justify-around pt-2 text-sm text-gray-600">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1 transition-colors ${
            liked ? "text-red-500" : "text-gray-600 hover:text-red-500"
          }`}
        >
          <Heart size={24} fill={liked ? "currentColor" : "none"} />
          <span className="text-sm">{likeCount}</span>
        </button>
      </div>
    </div>
  );
};

export default ActivityCard;
