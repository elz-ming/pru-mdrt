"use client";

import { useEffect, useState } from "react";
import ActivityCard from "./ActivityCard";
import ProgressBar from "./ProgressBar";
import supabase from "@/app/lib/supabaseClient";

interface Post {
  id: string;
  content: string;
  image_url?: string;
  created_at: string;
  users: {
    encoded_id: string;
    display_name: string;
    profile_pic_url?: string;
  };
  likeCount: number;
  likedByCurrentUser: boolean;
}

export default function ActivityFeed({ userId }: { userId?: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const encodedSelfId =
    typeof window !== "undefined" ? localStorage.getItem("encoded_id") : null;

  const fetchPosts = async () => {
    let query = supabase
      .from("posts")
      .select(
        `
    id,
    content,
    image_url,
    created_at,
    users:author_id (
      encoded_id,
      display_name,
      profile_pic_url
    )
  `
      )
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("author_id", userId);
    }

    const { data: postsData, error: postsError } = await query;

    if (postsError) {
      console.error("Error fetching posts:", postsError.message);
      return;
    }

    if (!postsData) {
      setLoading(false);
      return;
    }

    const enrichedPosts: Post[] = await Promise.all(
      (postsData as unknown as Post[]).map(async (post): Promise<Post> => {
        const user = post.users;

        const [likeCountRes, userLikedRes] = await Promise.all([
          supabase
            .from("likes")
            .select("*", { count: "exact", head: true })
            .eq("post_id", post.id),

          supabase
            .from("likes")
            .select("user_id")
            .eq("post_id", post.id)
            .eq("user_id", encodedSelfId)
            .maybeSingle(),
        ]);

        return {
          id: post.id,
          content: post.content,
          image_url: post.image_url,
          created_at: post.created_at,
          users: user,
          likeCount: likeCountRes.count || 0,
          likedByCurrentUser: !!userLikedRes.data,
        };
      })
    );

    setPosts(enrichedPosts);
    setLoading(false);
  };

  useEffect(() => {
    if (encodedSelfId) {
      fetchPosts();
    }
  }, [encodedSelfId]);

  if (loading) {
    return <p className="text-center mt-4">Loading feed...</p>;
  }

  return (
    <div className="h-full overflow-auto z-20 mt-4">
      <ProgressBar />
      <ul className="flex flex-col gap-4">
        {posts.map((post) => (
          <li key={post.id}>
            <ActivityCard
              postId={post.id}
              encoded_id={post.users?.encoded_id || ""}
              name={post.users?.display_name || "Anonymous"}
              profilePicUrl={
                post.users?.profile_pic_url || "/default-avatar.png"
              }
              activityDescription={post.content}
              activityPicUrl={post.image_url}
              createdAt={post.created_at}
              initialLikedByUser={post.likedByCurrentUser}
              initialLikeCount={post.likeCount}
              refreshFeed={fetchPosts}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
