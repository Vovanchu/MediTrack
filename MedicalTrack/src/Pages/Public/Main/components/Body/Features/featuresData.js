import stethoscope from "@/assets/images/features/stethoscope.svg";
import syringe from "@/assets/images/features/syringe.svg";
import flask from "@/assets/images/features/flask.svg";
import pulse from "@/assets/images/features/pulse_health.svg";

const featuresData = [
  {
    image: stethoscope,
    title: "Doctor Visits",
    description: "Schedule and track your medical appointments with healthcare professionals",
    href: "",
  },
  {
    image: syringe,
    title: "Vaccinations",
    description: "Keep track of your vaccination history and upcoming immunizations",
    href: "/services/vaccination",
  },
  {
    image: flask,
    title: "Medical Tests",
    description: "Monitor your lab results and schedule regular health screenings",
    href: "/services/analysis",
  },
  {
    image: pulse,
    title: "Health Tracking",
    description: "Record vital signs, medications, and overall health indicators",
    href: "/services/health-tracking",
  },
];

export default featuresData;
