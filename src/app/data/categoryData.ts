import {
  Lightbulb,
  Handshake,
  Target,
  BookOpenCheck,
  FileText,
  Reply,
  LucideIcon,
} from "lucide-react";

export type Category = {
  name: string;
  label: string;
  icon: LucideIcon;
  placeholder_name: string;
  placeholder_description: string;
};

export const categories: Category[] = [
  {
    name: "Ideation",
    label: "Ideation",
    icon: Lightbulb,
    placeholder_name: "Plan content for IG or TikTok",
    placeholder_description: "Draft idea for storytelling, carousel, or reel",
  },
  {
    name: "Cold Prospecting",
    label: "Cold Prospecting",
    icon: Target,
    placeholder_name: "Reach out to 5 new leads",
    placeholder_description: "Use Telegram, LinkedIn, or referral lists",
  },
  {
    name: "Warm Prospecting",
    label: "Warm Prospecting",
    icon: Handshake,
    placeholder_name: "Follow up with referral from Sarah",
    placeholder_description: "Send personalized message or schedule call",
  },
  {
    name: "Learning",
    label: "Learning",
    icon: BookOpenCheck,
    placeholder_name: "Watch product training module",
    placeholder_description: "Summarize takeaway on new policy features",
  },
  {
    name: "Administrative Task",
    label: "Administrative Task",
    icon: FileText,
    placeholder_name: "Submit underwriting documents",
    placeholder_description: "Double-check client info before upload",
  },
  {
    name: "Follow Up",
    label: "Follow Up",
    icon: Reply,
    placeholder_name: "Remind John to sign policy",
    placeholder_description: "Check in politely and offer help if needed",
  },
];
