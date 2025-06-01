"use client";

import { useState } from "react";

export default function AddPostButton() {
  const [showModal, setShowModal] = useState(false);
  const [text, setText] = useState("");

  const submitPost = () => {
    console.log("Submitted:", text);
    setShowModal(false);
    setText("");
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-24 right-4 bg-red-500 text-white w-14 h-14 flex items-center justify-center rounded-full shadow-xl text-2xl"
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
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share an update..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="text-sm text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={submitPost}
                className="bg-blue-500 text-white text-sm px-4 py-2 rounded"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
