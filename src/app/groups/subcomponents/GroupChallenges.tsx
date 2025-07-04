"use client";

export default function GroupChallenges() {
  const challenges = [
    {
      title: "2026 MDRT SUPERCHARGED CHALLENGE",
      description: "Push your limits and aim higher than ever before.",
    },
    {
      title: "July Client Outreach Sprint",
      description: "Reach out to 50 clients in 30 days.",
    },
    {
      title: "Elite Recruitment Blitz",
      description: "Recruit 5 new team members this quarter.",
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">2026 Challenges</h2>
      <div className="mt-4 space-y-4">
        {challenges.map((challenge, index) => (
          <div key={index} className="p-4 border rounded-lg shadow-sm bg-white">
            <h3 className="text-lg font-semibold">{challenge.title}</h3>
            <p className="text-gray-600 mt-1">{challenge.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
