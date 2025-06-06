"use client";

import { useState } from "react";

const dummyFriends = [
  { id: 1, name: "Alice Tan", username: "@alice" },
  { id: 2, name: "Ben Chong", username: "@ben" },
  { id: 3, name: "Chloe Lim", username: "@chloe" },
  { id: 4, name: "Daniel Ong", username: "@daniel" },
];

export default function SearchFriends() {
  const [query, setQuery] = useState("");

  const filteredFriends = dummyFriends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(query.toLowerCase()) ||
      friend.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search friends..."
        className="w-full p-2 border rounded-md"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <ul className="space-y-2">
        {filteredFriends.map((friend) => (
          <li
            key={friend.id}
            className="p-3 bg-gray-100 rounded-md flex flex-col"
          >
            <span className="font-semibold">{friend.name}</span>
            <span className="text-sm text-gray-600">{friend.username}</span>
          </li>
        ))}

        {filteredFriends.length === 0 && (
          <li className="text-sm text-gray-500 text-center">
            No friends found.
          </li>
        )}
      </ul>
    </div>
  );
}
