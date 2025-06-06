import {
  fetchMilestones,
  Milestone as FirestoreMilestone,
} from "./fetchMilestones";
import supabaseClient from "./supabaseClient";

export interface EnrichedMilestone extends FirestoreMilestone {
  achieved: boolean;
  completedAt: string | null;
  completionRate: number; // You can leave this as 0 for now
}

export async function fetchMergedMilestones(
  encodedId: string
): Promise<EnrichedMilestone[]> {
  // 1. Get static milestone list from Firestore
  const milestones = await fetchMilestones();

  // 2. Get user-specific progress from Supabase
  const { data: userProgress, error } = await supabaseClient
    .from("user_milestones")
    .select("milestone_name, completed_at")
    .eq("user_encoded_id", encodedId);

  if (error) {
    console.error("Failed to fetch user milestone progress:", error);
    return milestones.map((m) => ({
      ...m,
      achieved: false,
      completedAt: null,
      completionRate: 0,
    }));
  }

  // 3. Merge them
  const completedMap = new Map(
    userProgress.map((item) => [item.milestone_name, item.completed_at])
  );

  const merged = milestones.map((m) => {
    const completedAtRaw = completedMap.get(m.name);
    const completedAt =
      completedAtRaw && !isNaN(Date.parse(completedAtRaw))
        ? completedAtRaw
        : null;

    return {
      ...m,
      achieved: !!completedAt,
      completedAt,
      completionRate: 0,
    };
  });

  return merged;
}
