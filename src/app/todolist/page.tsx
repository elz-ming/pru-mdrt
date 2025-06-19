"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckSquare, Square, ChevronLeft, ChevronRight } from "lucide-react";
import supabase from "@/app/lib/supabaseClient";
import { categories } from "./categoryData";

import {
  isToday,
  isYesterday,
  isTomorrow,
  format,
  addDays,
  parseISO,
} from "date-fns";

type Task = {
  id: string;
  task_name: string;
  task_description?: string;
  status: "todo" | "completed";
  date: string;
  owner_id: string;
  category: string;
};

export default function ToDoPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      const encoded_id = localStorage.getItem("encoded_id");
      if (!encoded_id) return;

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("owner_id", encoded_id)
        .eq("date", date)
        .order("task_name", { ascending: true });

      if (!error && data) {
        setTasks(data);
      } else {
        console.error("Failed to fetch tasks", error);
      }
    };

    fetchTasks();
  }, [date]);

  const toggleDone = async (index: number) => {
    const task = tasks[index];
    const newStatus = task.status === "completed" ? "todo" : "completed";

    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", task.id);

    if (error) {
      console.error("Failed to update task:", error.message);
      return;
    }

    // Update local state
    setTasks((prev) =>
      prev.map((t, i) => (i === index ? { ...t, status: newStatus } : t))
    );
  };

  const getDateLabel = (date: string) => {
    const parsed = parseISO(date);

    if (isToday(parsed)) return "Today";
    if (isYesterday(parsed)) return "Yesterday";
    if (isTomorrow(parsed)) return "Tomorrow";

    const now = new Date();
    if (parsed < addDays(now, -1)) return "You're in the past...";
    if (parsed > addDays(now, 1)) return "Looking into the future huh?";

    return format(parsed, "dd MMM yyyy");
  };

  return (
    <div className="h-[calc(100vh-8rem)] bg-[#e31d1a] text-white overflow-hidden">
      {/* Top Bar with Date Selector */}
      <div className="flex justify-center items-center gap-4 p-4">
        <button
          onClick={() =>
            setDate((prev) => format(addDays(parseISO(prev), -1), "yyyy-MM-dd"))
          }
        >
          <ChevronLeft size={24} />
        </button>

        <button onClick={() => setShowDatePicker(!showDatePicker)}>
          <span className="font-semibold text-md">
            {format(parseISO(date), "dd MMM yyyy")}
          </span>
        </button>

        <button
          onClick={() =>
            setDate((prev) => format(addDays(parseISO(prev), 1), "yyyy-MM-dd"))
          }
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {showDatePicker && (
        <div className="flex justify-center mb-2">
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setShowDatePicker(false);
            }}
            className="border p-2 rounded"
          />
        </div>
      )}

      {/* Header Section */}
      <div className="flex justify-between items-center p-4">
        <div>
          <h1 className="text-xl font-semibold">{getDateLabel(date)}</h1>
          <p className="text-sm">
            {tasks.length} Task{tasks.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          className="bg-white text-[#e31d1a] px-4 py-2 rounded-lg shadow font-medium"
          onClick={() => router.push("/todolist/add")}
        >
          Add New
        </button>
      </div>

      {/* Task List Section */}
      <div className="flex flex-col gap-4 h-full bg-white text-black p-4 rounded-tl-[2rem] overflow-y-auto">
        <h2 className="text-lg font-semibold">My Tasks</h2>

        <div className="flex flex-col gap-4 overflow-y-auto pb-32 scroll-pb-32">
          {tasks.map((task, index) => {
            const category = categories.find((c) => c.name === task.category);

            return (
              <div
                key={task.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  task.status === "completed"
                    ? "bg-[#e31d1a]/20 border-none"
                    : "bg-white border border-[#e31d1a]/20"
                }`}
              >
                <div className="flex items-center gap-4">
                  {category?.icon && (
                    <category.icon className="text-[#e31d1a]" size={48} />
                  )}
                  <div className="flex flex-col">
                    <p className="font-semibold text-lg">{task.task_name}</p>
                    <p className="text-sm text-gray-600">
                      {task.task_description || "-"}
                    </p>
                  </div>
                </div>
                <button onClick={() => toggleDone(index)}>
                  {task.status === "completed" ? (
                    <CheckSquare className="text-[#e31d1a]" />
                  ) : (
                    <Square className="text-[#e31d1a]" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
