import { User, FileText, Activity, Heart, Settings } from "lucide-react";

const ProfileSectionsData = [
  {
    icon: User,
    title: "Personal Information",
    description: "Manage your basic information and contact details",
    href: "/my-profile/user-information",
    color: "blue",
  },
  {
    icon: Activity,
    title: "Health Indicators",
    description: "Track your vital signs and health metrics",
    href: "/my-profile/health-indicators",
    color: "green",
  },
  {
    icon: Heart,
    title: "Health Record",
    description: "View your complete medical history and records",
    href: "/my-profile/health-record",
    color: "red",
  },
  {
    icon: FileText,
    title: "Medical Documents",
    description: "Upload and manage your medical documents",
    href: "/my-profile/medical-documents",
    color: "purple",
  },
  {
    icon: Settings,
    title: "Settings",
    description: "Configure your account preferences and privacy",
    href: "/my-profile/settings",
    color: "gray",
  },
];

export default ProfileSectionsData;
