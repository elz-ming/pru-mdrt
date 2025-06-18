"use client";

import { useEffect, useState } from "react";
import supabase from "@/app/lib/supabaseClient";
import ProgressCard from "./ProgressCard";

const tierAchievements = [
  {
    tier: "bronze",
    color: "#a94c13",
    achievements: [
      { date: "2025-06-01", label: "Started" },
      { date: "2025-06-10", label: "Closed first client" },
      { date: "2025-06-20", label: "Completed product training" },
      { date: "2025-06-30", label: "Achieved Bronze" },
    ],
  },
  {
    tier: "silver",
    color: "#a8b1b7",
    achievements: [
      { date: "2025-05-01", label: "Started" },
      { date: "2025-05-10", label: "Closed 5 clients in a month" },
      { date: "2025-05-20", label: "Hosted first client workshop" },
      { date: "2025-05-31", label: "Achieved Bronze" },
      { date: "2025-06-15", label: "Maintained 100% activity streak" },
      { date: "2025-06-25", label: "Secured 10th client" },
      { date: "2025-06-30", label: "Achieved Silver" },
    ],
  },
  {
    tier: "gold",
    color: "#e5aa03",
    achievements: [
      { date: "2025-04-01", label: "Started" },
      { date: "2025-04-10", label: "Closed a family protection plan" },
      { date: "2025-04-20", label: "Built a diverse client portfolio" },
      { date: "2025-04-30", label: "Achieved Bronze" },
      { date: "2025-05-10", label: "Acquired first high-profile client" },
      { date: "2025-05-20", label: "Secured 3 client referrals" },
      { date: "2025-05-31", label: "Achieved Silver" },
      { date: "2025-06-15", label: "Hosted financial literacy seminar" },
      { date: "2025-06-25", label: "Won internal top advisor award" },
      { date: "2025-06-30", label: "Achieved Gold" },
    ],
  },
  {
    tier: "MDRT",
    color: "#e31d1a",
    achievements: [
      { date: "2025-03-01", label: "Started" },
      { date: "2025-03-10", label: "Onboarded high-impact client" },
      { date: "2025-03-20", label: "Mentored a junior consultant" },
      { date: "2025-03-31", label: "Achieved Bronze" },
      { date: "2025-04-10", label: "Closed 3 keyman plans for SMEs" },
      { date: "2025-04-20", label: "Launched estate planning framework" },
      { date: "2025-04-30", label: "Achieved Silver" },
      { date: "2025-05-10", label: "Built high-net-worth client base" },
      {
        date: "2025-05-20",
        label: "Expanded client portfolio significantly",
      },
      { date: "2025-05-31", label: "Achieved Gold" },
      { date: "2025-06-15", label: "Recognized in regional leaderboard" },
      { date: "2025-06-25", label: "Completed MDRT qualifying case" },
      { date: "2025-06-30", label: "Achieved MDRT" },
    ],
  },
  {
    tier: "COT",
    color: "#8b2bbc",
    achievements: [
      { date: "2025-02-01", label: "Started" },
      { date: "2025-02-08", label: "Spoke at client investment event" },
      { date: "2025-02-18", label: "Handled complex multi-family plan" },
      { date: "2025-02-28", label: "Achieved Bronze" },
      { date: "2025-03-10", label: "Designed cross-generational policy" },
      { date: "2025-03-20", label: "Became team lead for MDRT circle" },
      { date: "2025-03-31", label: "Achieved Silver" },
      { date: "2025-04-10", label: "Completed client succession plan" },
      { date: "2025-04-20", label: "Signed 3 high-value referrals" },
      { date: "2025-04-30", label: "Achieved Gold" },
      { date: "2025-05-10", label: "Surpassed performance benchmarks" },
      { date: "2025-05-20", label: "Trained next-gen advisor" },
      { date: "2025-05-31", label: "Achieved MDRT" },
      { date: "2025-06-15", label: "Closed regional flagship case" },
      { date: "2025-06-25", label: "Awarded national top 3 status" },
      { date: "2025-06-30", label: "Achieved COT" },
    ],
  },
  {
    tier: "TOT",
    color: "#74cdf2",
    achievements: [
      { date: "2025-01-01", label: "Started" },
      { date: "2025-01-08", label: "Onboarded private banking client" },
      { date: "2025-01-20", label: "Built a premier client portfolio" },
      { date: "2025-01-31", label: "Achieved Bronze" },
      { date: "2025-02-08", label: "Formed elite wealth circle" },
      { date: "2025-02-20", label: "Opened offshore planning case" },
      { date: "2025-02-28", label: "Achieved Silver" },
      { date: "2025-03-10", label: "Headlined wealth summit session" },
      { date: "2025-03-20", label: "Completed strategic legacy plan" },
      { date: "2025-03-31", label: "Achieved Gold" },
      { date: "2025-04-10", label: "Won national mega case award" },
      { date: "2025-04-20", label: "Led training for 20 advisors" },
      { date: "2025-04-30", label: "Achieved MDRT" },
      { date: "2025-05-10", label: "Closed ultra-complex estate plan" },
      { date: "2025-05-20", label: "Recognized by global leadership board" },
      { date: "2025-05-31", label: "Achieved COT" },
      { date: "2025-06-15", label: "Reached pinnacle career milestone" },
      { date: "2025-06-25", label: "Recognized as company legend" },
      { date: "2025-06-30", label: "Achieved TOT" },
    ],
  },
];

function groupAchievementsByMonth(
  achievements: { date: string; label: string }[]
) {
  const map = new Map<string, { date: string; label: string }[]>();

  achievements
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .forEach((item) => {
      const date = new Date(item.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    });

  return Array.from(map.entries()).map(([key, items]) => {
    const dateObj = new Date(`${key}-01`);
    const label = dateObj.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    return { label, items };
  });
}

export default function Progress({ userId }: { userId?: string }) {
  const [userAchievements, setUserAchievements] = useState<
    { date: string; label: string }[]
  >([]);
  const [color, setColor] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserTier = async () => {
      const encodedId = userId;

      if (!encodedId) return;

      const { data, error } = await supabase
        .from("users")
        .select("tier")
        .eq("encoded_id", encodedId)
        .single();

      if (error || !data) {
        console.error("Failed to fetch user tier:", error);
        return;
      }

      // Flatten all achievements up to the user's tier
      const tierData = tierAchievements.find((t) => t.tier === data.tier);

      if (!tierData) return;

      setUserAchievements(tierData.achievements);
      setColor(tierData.color);
    };

    fetchUserTier();
  }, []);

  const grouped = groupAchievementsByMonth(userAchievements);

  return (
    <div className="flex flex-col p-4 gap-4 mb-4">
      {/* Bottom Row: Vertical Timeline */}
      <div className="relative flex-1 bg-white rounded-lg overflow-hidden min-h-0 shadow-md">
        {/* Vertical line */}
        <div
          className="absolute left-8 top-0 bottom-10 w-1"
          style={{ backgroundColor: color || "#999" }}
        />

        <div className="flex flex-col">
          {grouped.map((group, idx) => (
            <ProgressCard
              key={idx}
              monthLabel={group.label}
              items={group.items}
              color={color}
            />
          ))}
        </div>

        {/* Glowing end circle */}
        <div className="absolute left-[18px] bottom-8 translate-y-6">
          <div
            className={`w-8 h-8 rounded-full animate-pulse shadow-lg`}
            style={{ backgroundColor: color || "#e31d1a" }}
          />
        </div>
      </div>
    </div>
  );
}
