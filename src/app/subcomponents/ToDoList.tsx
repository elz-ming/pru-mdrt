"use client";

import { useState } from "react";

export default function ToDoList() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Follow up 3 clients", done: false },
    { id: 2, text: "Log today's sales", done: true },
    { id: 3, text: "Schedule team meeting", done: false },
  ]);

  const [expanded, setExpanded] = useState(false);

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

  const visibleTasks = expanded ? tasks : tasks.slice(0, 1);

  return (
    <>
      <div
        className={`fixed w-full h-24 px-4  py-2 z-40 ${
          expanded ? "bg-gray-800/90" : "bg-gray-800"
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-lg text-white">Your To-Do List</h2>
          {tasks.length > 1 && (
            <button
              className="text-sm text-blue-500 underline"
              onClick={() => setExpanded((prev) => !prev)}
            >
              {expanded ? "Collapse ▲" : "Expand ▼"}
            </button>
          )}
        </div>

        <ul className="space-y-2">
          {visibleTasks.map((task) => (
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
      </div>
      {expanded && (
        <div
          className="fixed top-40 left-0 w-full h-full bg-gray-800/90 z-30"
          onClick={() => setExpanded(false)}
        />
      )}
    </>
  );
}
