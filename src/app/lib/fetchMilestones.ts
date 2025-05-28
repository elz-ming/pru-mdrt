"use client";

import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

// ✅ Explicit type definition
export interface Milestone {
  id: string;
  name: string;
  displayName: string;
  description: string;
  order: number;
  created_at?: any;
  updated_at?: any;
}

export async function fetchMilestones(): Promise<Milestone[]> {
  const querySnapshot = await getDocs(collection(db, "milestones"));

  const data: Milestone[] = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Milestone, "id">),
  }));

  data.sort((a, b) => a.order - b.order);
  return data;
}
