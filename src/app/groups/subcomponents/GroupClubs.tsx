"use client";

import ClubCard from "@/app/groups/subcomponents/ClubCard";

export default function GroupClubs() {
  const mockClubs = [
    {
      logoUrl: "/default-group.jpg",
      name: "Pru Family",
      members: 5200,
      location: "Singapore",
      posts: 300,
      latestPost: "Welcome to PruMDRT!",
    },
    {
      logoUrl: "/default-group.jpg",
      name: "Pei Shih's Study Group",
      members: 20,
      location: "Singapore",
      posts: 30,
    },
    {
      logoUrl: "/default-group.jpg",
      name: "Cloven's Study Group",
      members: 100,
      location: "Singapore",
      posts: 20,
    },
    {
      logoUrl: "/default-group.jpg",
      name: "Mentorship Program Cohort-3",
      members: 30,
      location: "Singapore",
      posts: 10,
      latestPost: "Last Saturday, we've kickstarted...!",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="fixed w-full h-16 flex items-center justify-between px-4 py-3 bg-white">
        <p className="text-gray-700 font-medium">Create your own MDRT club</p>
        <button className="border border-[#e31d1a] text-[#e31d1a] font-semibold px-4 py-1 rounded-full hover:bg-[#e31d1a] hover:text-white transition">
          Create a Club
        </button>
      </div>

      <div className="flex flex-col gap-4 mt-20">
        {mockClubs.map((club, i) => (
          <div key={i}>
            <div className="bg-white">
              <ClubCard {...club} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
