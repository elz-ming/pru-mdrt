"use client";

import React from "react";
import { MoreHorizontal, Heart, MessageCircle, Share } from "lucide-react";

interface ActivityCardProps {
  name: string;
  activityTitle: string;
  activityDescription: string;
  profilePicUrl?: string | null; // optional for now
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  name,
  activityTitle,
  activityDescription,
  profilePicUrl,
}) => {
  return (
    <div className="bg-white p-4 space-y-3">
      {/* Top Part: Profile + Name + Menu */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
            {profilePicUrl ? (
              <img
                src={profilePicUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>
          <p className="font-semibold text-sm">{name}</p>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Middle Part: Activity */}
      <div>
        <h3 className="font-semibold text-base">{activityTitle}</h3>
        <p className="text-sm text-gray-600 mt-1">{activityDescription}</p>
      </div>

      {/* Bottom Part: Actions */}
      <div className="flex justify-around pt-2 text-sm text-gray-600">
        <button className="flex items-center gap-1 hover:text-red-500">
          <Heart size={24} />
        </button>
        <button className="flex items-center gap-1 hover:text-blue-500">
          <MessageCircle size={24} />
        </button>
        <button className="flex items-center gap-1 hover:text-green-500">
          <Share size={24} />
        </button>
      </div>
    </div>
  );
};

export default ActivityCard;
