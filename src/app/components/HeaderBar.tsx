"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, Search } from "lucide-react";
import Image from "next/image";

export default function HeaderBar({ title }: { title: string }) {
  const router = useRouter();
  const [encodedId, setEncodedId] = useState<string | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("encoded_id");
    const pic = localStorage.getItem("profile_pic_url"); // store this during login if not already
    if (id) setEncodedId(id);
    if (pic) setProfilePicUrl(pic);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full h-16 z-50 flex justify-between items-center px-4 py-3 bg-[#e31d1a] text-white">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="flex items-center gap-8">
        {encodedId && (
          <button
            onClick={() => router.push(`/user/${encodedId}`)}
            className="w-8 h-8 rounded-full overflow-hidden"
          >
            {profilePicUrl ? (
              <Image
                src={profilePicUrl}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full object-cover border-white border-2"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-full" />
            )}
          </button>
        )}
        <button onClick={() => router.push("/search")}>
          <Search size={32} />
        </button>
        <button onClick={() => router.push("/settings")}>
          <Settings size={32} />
        </button>
      </div>
    </header>
  );
}
