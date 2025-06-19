"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Lightbulb,
  Handshake,
  Target,
  BookOpenCheck,
  FileText,
  Reply,
  ChevronRight,
  ArrowLeft,
  LucideIcon,
} from "lucide-react";
import supabase from "@/app/lib/supabaseClient";

type Category = {
  name: string;
  label: string;
  icon: LucideIcon;
  placeholder_name: string;
  placeholder_description: string;
};

const categories: Category[] = [
  {
    name: "Ideation",
    label: "Ideation",
    icon: Lightbulb,
    placeholder_name: "Plan content for IG or TikTok",
    placeholder_description: "Draft idea for storytelling, carousel, or reel",
  },
  {
    name: "Cold Prospecting",
    label: "Cold Prospecting",
    icon: Target,
    placeholder_name: "Reach out to 5 new leads",
    placeholder_description: "Use Telegram, LinkedIn, or referral lists",
  },
  {
    name: "Warm Prospecting",
    label: "Warm Prospecting",
    icon: Handshake,
    placeholder_name: "Follow up with referral from Sarah",
    placeholder_description: "Send personalized message or schedule call",
  },
  {
    name: "Learning",
    label: "Learning",
    icon: BookOpenCheck,
    placeholder_name: "Watch product training module",
    placeholder_description: "Summarize takeaway on new policy features",
  },
  {
    name: "Administrative Task",
    label: "Administrative Task",
    icon: FileText,
    placeholder_name: "Submit underwriting documents",
    placeholder_description: "Double-check client info before upload",
  },
  {
    name: "Follow Up",
    label: "Follow Up",
    icon: Reply,
    placeholder_name: "Remind John to sign policy",
    placeholder_description: "Check in politely and offer help if needed",
  },
];

export default function AddTaskPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Format: "YYYY-MM-DD"
  });

  const handleCreate = async () => {
    const encoded_id = localStorage.getItem("encoded_id");
    if (!encoded_id) {
      alert("User not found. Please log in again.");
      return;
    }

    if (!selectedCategory || !name || !date) {
      alert("Please fill in all required fields.");
      return;
    }

    const { error } = await supabase.from("tasks").insert({
      owner_id: encoded_id,
      date,
      category: selectedCategory,
      task_name: name,
      task_description: desc,
    });

    if (error) {
      console.error("Failed to insert task:", error.message);
      alert("❌ Something went wrong while creating the task.");
    } else {
      alert("✅ Task created successfully.");
      router.push("/todolist");
    }
  };
  const selected = categories.find((cat) => cat.name === selectedCategory);

  return (
    <>
      {/* Custom header with back button */}
      <header className="flex w-full items-center gap-4 px-4 py-3 bg-white">
        <button
          onClick={() => {
            if (step === 1) {
              router.back();
            } else {
              setStep(1);
            }
          }}
        >
          <ArrowLeft size={40} />
        </button>
        <h1 className="text-xl font-bold">Create Task</h1>
      </header>

      <div className="max-h-screen text-black px-4 py-4">
        {step === 1 && (
          <>
            {/* Category List */}
            <div className="flex flex-col gap-3">
              {categories.map((cat, i) => (
                <button
                  key={i}
                  className="flex justify-between items-center bg-[#e31d1a]/20 p-4 rounded-lg"
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setStep(2);
                  }}
                >
                  <div className="flex gap-4 items-center">
                    <cat.icon className="text-[#e31d1a]" />

                    <p className="text-md text-left font-semibold">
                      {cat.label}
                    </p>
                  </div>
                  <ChevronRight />
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            {selected && (
              <div className="flex gap-4 items-center bg-[#e31d1a]/20 p-4 rounded-lg">
                <selected.icon className="text-[#e31d1a]" />
                <p className="text-md text-left font-semibold">
                  {selected.label}
                </p>
              </div>
            )}

            <div>
              <label className="block text-lg font-mono">Date</label>
              <input
                type="date"
                className="w-full border p-2 rounded"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-lg font-mono">Name</label>
              <input
                type="text"
                placeholder={selected?.placeholder_name ?? "Task name"}
                className="w-full border p-2 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-lg font-mono">Description</label>
              <textarea
                placeholder={
                  selected?.placeholder_description ?? "Task description..."
                }
                className="w-full border p-2 rounded"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>

            <button
              onClick={handleCreate}
              className="bg-[#e31d1a] w-full text-white p-2 rounded-lg font-semibold"
            >
              Create Task
            </button>
          </div>
        )}
      </div>
    </>
  );
}
