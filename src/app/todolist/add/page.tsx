"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import supabase from "@/app/lib/supabaseClient";
import { categories } from "../../data/categoryData";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { QUOTES } from "@/app/data/quoteData";

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
  const [quote, setQuote] = useState<string>("");

  useEffect(() => {
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(randomQuote);
  }, []);

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

      <div className="h-screen text-black px-4 py-4">
        {step === 1 && (
          <>
            {/* Category List */}
            <div className="flex flex-col justify-between h-full pb-32">
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
                      <cat.icon className="text-[#e31d1a]" size={40} />

                      <p className="text-xl text-left font-semibold">
                        {cat.label}
                      </p>
                    </div>
                    <ChevronRight />
                  </button>
                ))}
              </div>

              {/* Motivational Quote Box */}
              <div className="mx-4 rounded-2xl bg-white/90 text-[#e31d1a] p-4 border border-[#e31d1a] shadow-md">
                <p className="text-center text-lg italic">{quote}</p>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            {selected && (
              <div className="flex gap-4 items-center bg-[#e31d1a]/20 p-4 rounded-lg">
                <selected.icon className="text-[#e31d1a]" size={40} />
                <p className="text-xl text-left font-semibold">
                  {selected.label}
                </p>
              </div>
            )}

            <div>
              <label className="block text-xl font-mono">Date</label>
              <input
                type="date"
                className="w-full border p-4 rounded"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xl font-mono">Name</label>
              <input
                type="text"
                placeholder={selected?.placeholder_name ?? "Task name"}
                className="w-full border p-4 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xl font-mono">Description</label>
              <textarea
                placeholder={
                  selected?.placeholder_description ?? "Task description..."
                }
                className="w-full border p-4 rounded"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>

            <button
              onClick={handleCreate}
              className="bg-[#e31d1a] w-full text-xl text-white p-4 rounded-lg font-semibold"
            >
              Create Task
            </button>
          </div>
        )}
      </div>
    </>
  );
}
