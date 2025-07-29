import Stethoscope from "@/assets/images/features/stethoscope.svg";
import Syringe from "@/assets/images/features/syringe.svg";
import FlaskConical from "@/assets/images/features/flask.svg";
import Droplets from "@/assets/images/features/droplets.svg";
import Pill from "@/assets/images/features/pill.svg";

const servicesData = [
  {
    image: Stethoscope,
    title: "Doctor Visits",
    description:
      "Schedule appointments with medical specialists and track your consultations",
    href: "/services/doctor-visits",
  },
  {
    image: Syringe,
    title: "Vaccination",
    description:
      "Manage your vaccination schedule and track immunization history",
    href: "/services/vaccination",
  },
  {
    image: FlaskConical,
    title: "Analysis & Tests",
    description: "Schedule medical tests and track your laboratory results",
    href: "/services/analysis",
  },
  {
    image: Droplets,
    title: "Blood Donation",
    description: "Learn about blood donation and schedule your next donation",
    href: "/services/blood-donation",
  },
  {
    image: Pill,
    title: "Taking Medications",
    description: "Create treatment plans and set medication reminders",
    href: "/services/medications",
  },
];

export default servicesData;
