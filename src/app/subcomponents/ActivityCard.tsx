"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal, Heart, MessageCircle, Share } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityCardProps {
  encoded_id: string;
  name: string;
  activityDescription: string;
  profilePicUrl?: string | null;
  activityPicUrl?: string | null;
  createdAt?: string; // ISO string
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  encoded_id,
  name,
  activityDescription,
  profilePicUrl,
  activityPicUrl,
  createdAt,
}) => {
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
        <button className="text-gray-500 hover:text-gray-700">
          <MoreHorizontal size={18} />
        </button>
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
        <button className="flex items-center hover:text-red-500">
          <Heart size={24} />
        </button>
        <button className="flex items-center hover:text-blue-500">
          <MessageCircle size={24} />
        </button>
        <button className="flex items-center hover:text-green-500">
          <Share size={24} />
        </button>
      </div>
    </div>
  );
};

export default ActivityCard;
