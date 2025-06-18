"use client";

import { useState } from "react";
import { CheckSquare, Square } from "lucide-react";

const dates = [
  { day: "14", label: "Mon" },
  { day: "15", label: "Tue" },
  { day: "16", label: "Wed" },
  { day: "17", label: "Thu" },
];

const initialTasks = [
  {
    title: "Fitness",
    desc: "Exercise and gym",
    done: true,
  },
  {
    title: "Check Emails and sms",
    desc: "Review and respond to emails and SMS",
    done: true,
  },
  {
    title: "Work on Projects",
    desc: "Focus on all the tasks related to Project",
    done: true,
  },
  {
    title: "Attend Meeting",
    desc: "Team meeting with the client ABC",
    done: false,
  },
  {
    title: "Work of XYZ",
    desc: "Change theme and ideas in XYZ",
    done: false,
  },
  {
    title: "Lunch Break",
    desc: "Enjoy a healthy lunch and take some rest",
    done: false,
  },
  {
    title: "Work of XYZ",
    desc: "Change theme and ideas in XYZ",
    done: false,
  },
  {
    title: "Lunch Break",
    desc: "Enjoy a healthy lunch and take some rest",
    done: false,
  },
];

export default function ToDoPage() {
  const [selectedDate, setSelectedDate] = useState("14");
  const [tasks, setTasks] = useState(initialTasks);

  const toggleDone = (index: number) => {
    setTasks((prev) =>
      prev.map((task, i) =>
        i === index ? { ...task, done: !task.done } : task
      )
    );
  };

  return (
    <div className="h-[calc(100vh-8rem)] bg-[#e31d1a] text-white overflow-hidden">
      {/* Top Bar */}
      <div className="flex justify-center items-center p-4">
        <span className="font-semibold text-md">14 Sept</span>
      </div>

      {/* Header Section */}
      <div className="flex justify-between items-center p-4">
        <div>
          <h1 className="text-2xl font-semibold">Today</h1>
          <p className="text-sm">6 Tasks</p>
        </div>
        <button className="bg-white text-[#e31d1a] px-4 py-2 rounded-lg shadow font-medium">
          Add New
        </button>
      </div>

      {/* Task List Section */}
      <div className="flex flex-col gap-4 h-full bg-white text-black p-4 rounded-tl-[2rem] overflow-y-auto">
        <h2 className="text-lg font-semibold">My Tasks</h2>

        <div className="flex flex-col gap-4 overflow-y-auto pb-32 scroll-pb-32">
          {tasks.map((task, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-lg ${
                task.done
                  ? "bg-[#e31d1a]/20 border-none"
                  : "bg-white border border-[#e31d1a]/20"
              }`}
            >
              <div>
                <p className="font-semibold">{task.title}</p>
                <p className="text-sm text-gray-600">{task.desc}</p>
              </div>
              <button onClick={() => toggleDone(index)}>
                {task.done ? (
                  <CheckSquare className="text-[#e31d1a]" />
                ) : (
                  <Square className="text-[#e31d1a]" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
