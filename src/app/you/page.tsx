"use client";

import { useEffect, useState } from "react";
import {
  fetchMergedMilestones,
  EnrichedMilestone,
} from "@/app/lib/fetchMergedMilestones";
import MilestoneCard from "./subcomponents/MilestoneCard";

export default function YouPage() {
  const [milestones, setMilestones] = useState<EnrichedMilestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const encodedId = localStorage.getItem("encoded_id"); // or from session/token

    if (!encodedId) return;

    const load = async () => {
      const enriched = await fetchMergedMilestones(encodedId);
      setMilestones(enriched);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <div className="p-4">Loading milestones...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Your Achievements</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {milestones.map((m) => (
          <MilestoneCard
            key={m.id}
            displayName={m.displayName}
            description={m.description}
            achieved={m.achieved}
            completedAt={
              m.completedAt && !isNaN(Date.parse(m.completedAt))
                ? new Date(m.completedAt)
                : null
            }
            completionRate={m.completionRate}
          />
        ))}
      </div>
    </div>
  );
}
