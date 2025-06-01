"use client";

import { useState } from "react";

export default function ToDoList() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Follow up 3 clients", done: false },
    { id: 2, text: "Log today's sales", done: true },
  ]);

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const removeTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <ul className="px-4 py-2 space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex items-center justify-between bg-white rounded shadow px-3 py-2"
        >
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(task.id)}
            />
            <span className={task.done ? "line-through text-gray-400" : ""}>
              {task.text}
            </span>
          </label>
          <button
            className="text-red-500 text-xs"
            onClick={() => removeTask(task.id)}
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
