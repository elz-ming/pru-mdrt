"use client";

import { useState, useEffect } from "react";

export default function ActivityFeed() {
  const [posts, setPosts] = useState<string[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const loadPosts = () => {
      const newPosts = Array.from(
        { length: 10 },
        (_, i) => `Activity Post #${page * 10 + i + 1}`
      );
      setPosts((prev) => [...prev, ...newPosts]);
    };

    loadPosts();
  }, [page]);

  const handleScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) setPage((prev) => prev + 1);
  };

  return (
    <div className="h-full overflow-auto" onScroll={handleScroll}>
      <ul className="p-4 space-y-4">
        {posts.map((post, idx) => (
          <li
            key={idx}
            className="bg-gray-100 p-3 rounded shadow-sm text-sm text-gray-700"
          >
            {post}
          </li>
        ))}
      </ul>
    </div>
  );
}
