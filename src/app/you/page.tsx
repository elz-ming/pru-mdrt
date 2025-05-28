"use client";

import { useEffect, useState } from "react";
import { fetchMilestones } from "@/app/lib/fetchMilestones";
import MilestoneCard from "./subcomponents/MilestoneCard";

export default function ProfilePage() {
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchMilestones();
      setMilestones(data);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <div className="p-4">Loading milestones...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Your Achievements</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {milestones.map((milestone) => (
          <MilestoneCard
            key={milestone.id}
            displayName={milestone.displayName}
            description={milestone.description}
            achieved={false} // To be dynamically filled
            completedAt={null} // To be dynamically filled
            completionRate={0} // To be dynamically filled
          />
        ))}
      </div>
    </div>
  );
}
