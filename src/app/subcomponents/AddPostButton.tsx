"use client";

import { useState } from "react";
import { put } from "@vercel/blob";
import { Buffer } from "buffer";
import { v4 as uuidv4 } from "uuid";
import supabase from "@/app/lib/supabaseClient";

export default function AddPostButton() {
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const submitPost = async () => {
    const encodedId = localStorage.getItem("encoded_id");
    if (!encodedId || !content.trim()) return;

    setLoading(true);
    let imageUrl = "";

    try {
      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploaded = await put(`${uuidv4()}.jpg`, buffer, {
          access: "public",
          token:
            "vercel_blob_rw_h6O7E2zxIywUtuwc_NR0JPIcwY4xrqnsVXAS5O1ZLbCuSm2",
        });

        imageUrl = uploaded.url;
      }

      const { error } = await supabase.from("posts").insert({
        author_id: encodedId,
        content: content.trim(),
        image_url: imageUrl,
        likes_count: 0,
        comments_count: 0,
      });

      if (!error) {
        setShowModal(false);
        setContent("");
        setFile(null);
      } else {
        console.error("Error submitting post:", error);
      }
    } catch (uploadError) {
      console.error("Upload failed:", uploadError);
    }

    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-24 right-4 bg-red-500 text-white w-16 h-16 flex items-center justify-center rounded-full shadow-xl text-2xl"
      >
        +
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-sm space-y-4">
            <h2 className="text-lg font-semibold">New Post</h2>
            <textarea
              className="w-full border rounded p-2"
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share an update..."
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full border rounded p-2 text-sm"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="text-sm text-gray-500"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={submitPost}
                className="bg-blue-500 text-white text-sm px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
