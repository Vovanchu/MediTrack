import stethoscope from "@/assets/images/features/stethoscope.svg";
import syringe from "@/assets/images/features/syringe.svg";
import flask from "@/assets/images/features/flask.svg";
import pulse from "@/assets/images/features/pulse_health.svg";
import blood from "@/assets/images/features/Droplets.svg";
import pill from "@/assets/images/features/Pill.svg";

const featuresData = [
  {
    image: stethoscope,
    title: "Doctor Visits",
    description:
      "Schedule & track your doctor appointments and save prescriptions and consultation records all in one place.",
    href: "/services/doctor-visits",
  },
  {
    image: syringe,
    title: "Vaccinations",
    description:
      "Make sure you won’t skip vaccinations, and check the recommended timing for vaccines based on your age group.",
    href: "/services/vaccination",
  },
  {
    image: flask,
    title: "Lab Tests",
    description:
      "Monitor your lab results and create your personal schedule of blood work for a given period of time.",
    href: "/services/analysis",
  },
  {
    image: pulse,
    title: "Health Tracking",
    description:
      "Record your vitals, generate reports, and notice health trends that may require your attention.",
    href: "/services/analysis",
  },
  {
    image: blood,
    title: "Blood Donation",
    description:
      "Plan an adequate recovery time and schedule realistic future donations with your health in mind.",
    href: "/services/blood-donation",
  },
  {
    image: pill,
    title: "Pill Reminder",
    description:
      "Never skip taking your pills with Welltrack’s reminders — just enter your dosage and set up a schedule.",
    href: "/services/medications",
  },
];

export default featuresData;
