"use client";

import { useState, useEffect } from "react";
import ActivityCard from "./ActivityCard"; // Adjust path as needed

// Dictionary of 10 sample activities
const ACTIVITY_DICTIONARY = [
  {
    name: "Lin Zhenming",
    activityTitle: "Closed 3 new policy deals",
    activityDescription: "Hit his weekly target in just 2 days!",
    profilePicUrl: "",
  },
  {
    name: "Vanessa Cheong",
    activityTitle: "Shared a client success story",
    activityDescription: "A heartfelt story about a young family.",
    profilePicUrl: "",
  },

  {
    name: "Cloven",
    activityTitle: "Achieved MDRT milestone",
    activityDescription: "Officially hit the 2025 MDRT qualification.",
    profilePicUrl: "",
  },
  {
    name: "Pei Shih",
    activityTitle: "Won the weekly challenge",
    activityDescription: "Ranked #1 in team leaderboard this week.",
    profilePicUrl: "",
  },
  {
    name: "Rithik",
    activityTitle: "Hosted a financial wellness talk",
    activityDescription: "Educated over 50 attendees on budgeting.",
    profilePicUrl: "",
  },
  {
    name: "Ze Yan",
    activityTitle: "Joined a new agency team",
    activityDescription: "Excited to kickstart his new journey!",
    profilePicUrl: "",
  },
  {
    name: "Nikitha",
    activityTitle: "Referred a new client",
    activityDescription: "Generated a quality lead through referral.",
    profilePicUrl: "",
  },
  {
    name: "Jun Wen",
    activityTitle: "Updated her portfolio",
    activityDescription: "Revamped her offerings and visuals.",
    profilePicUrl: "",
  },
  {
    name: "Hannah",
    activityTitle: "Completed a training course",
    activityDescription: "Graduated from the digital prospecting bootcamp.",
    profilePicUrl: "",
  },
  {
    name: "Elizabeth",
    activityTitle: "Posted a motivational quote",
    activityDescription: `"Success is not final; failure is not fatal."`,
    profilePicUrl: "",
  },
];

export default function ActivityFeed() {
  return (
    <div className="h-full overflow-auto z-20">
      <ul className="flex flex-col gap-4">
        {ACTIVITY_DICTIONARY.map((post, idx) => (
          <li key={idx}>
            <ActivityCard
              profilePicUrl={post.profilePicUrl}
              name={post.name}
              activityTitle={post.activityTitle}
              activityDescription={post.activityDescription}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
