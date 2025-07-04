"use client";

import { CheckSquare, Square } from "lucide-react";
import { categories } from "../../data/categoryData";

type Task = {
  id: string;
  task_name: string;
  task_description?: string;
  status: "todo" | "completed";
  date: string;
  owner_id: string;
  category: string;
};

export default function TaskItem({
  task,
  index,
  toggleDone,
}: {
  task: Task;
  index: number;
  toggleDone: (index: number) => void;
}) {
  const category = categories.find((c) => c.name === task.category);

  return (
    <div
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
}
