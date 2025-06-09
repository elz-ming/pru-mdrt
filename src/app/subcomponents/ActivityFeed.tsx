"use client";

import { useEffect, useState } from "react";
import ActivityCard from "./ActivityCard";
import supabase from "@/app/lib/supabaseClient";

interface Post {
  id: string;
  content: string;
  image_url?: string;
  created_at: string;
  users: {
    display_name: string;
    profile_pic_url?: string;
  };
}

export default function ActivityFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          id,
          content,
          image_url,
          created_at,
          users:author_id (
            display_name,
            profile_pic_url
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error.message);
        return;
      }

      setPosts((data as unknown as Post[]) || []);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <p className="text-center mt-4">Loading feed...</p>;
  }

  return (
    <div className="h-full overflow-auto z-20">
      <ul className="flex flex-col gap-4">
        {posts.map((post) => (
          <li key={post.id}>
            <ActivityCard
              name={post.users?.display_name || "Anonymous"}
              profilePicUrl={
                post.users?.profile_pic_url || "/default-avatar.png"
              }
              activityDescription={post.content}
              activityPicUrl={post.image_url}
              createdAt={post.created_at}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
