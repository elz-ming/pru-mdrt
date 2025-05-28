import { format } from "date-fns";

interface MilestoneCardProps {
  displayName: string;
  description: string;
  achieved?: boolean;
  completedAt?: Date | null;
  completionRate: number;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({
  displayName,
  description,
  achieved = false,
  completedAt,
  completionRate,
}) => {
  return (
    <div
      className={`rounded-lg p-4 border shadow-sm transition ${
        achieved
          ? "bg-white text-black border-green-400"
          : "bg-gray-100 text-gray-400 border-gray-300"
      }`}
    >
      <h3 className="text-md font-semibold">{displayName}</h3>
      <p className="text-sm mt-1">{description}</p>

      <p className="text-xs mt-2 italic">
        {completionRate.toFixed(1)}% of users have completed this achievement.
      </p>

      {achieved && (
        <div className="mt-2 text-green-600 text-sm font-semibold">
          ✅ Completed
          {completedAt && (
            <p className="text-xs text-green-700 mt-1">
              Completed on {format(new Date(completedAt), "MM/dd/yyyy h:mm a")}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MilestoneCard;
