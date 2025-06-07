import Image from "next/image";

interface ClubCardProps {
  logoUrl: string;
  name: string;
  members: number;
  location: string;
  posts: number;
  latestPost?: string;
}

export default function ClubCard({
  logoUrl,
  name,
  members,
  location,
  posts,
  latestPost,
}: ClubCardProps) {
  return (
    <div className="flex gap-4 items-start px-4 py-3">
      <Image
        src={logoUrl}
        alt={name}
        width={50}
        height={50}
        className="rounded"
      />
      <div className="flex-1">
        <h3 className="font-bold">{name}</h3>
        <p className="text-sm text-gray-600">
          🧑‍💼 {members.toLocaleString()} Members · {location} · {posts} posts
        </p>
        {latestPost && (
          <div className="mt-1 flex items-center gap-1 text-sm text-[#e31d1a] font-medium">
            🔔<span className="truncate">&quot;{latestPost}&quot;</span>
          </div>
        )}
      </div>
    </div>
  );
}
