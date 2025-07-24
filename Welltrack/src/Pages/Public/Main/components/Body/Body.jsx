import React from "react";

import "./Body.scss";
import heart from "@/assets/images/heart.svg";
import Features from "./Features/Features";

export default function Body() {
  return (
    <section className="section_body">
      <img src={heart} alt="Heart Logo" className="section_body_image" />
      <h1 className="section_body_title">HealthCare Management</h1>
      <p className="section_body_subtitle">
        Take control of your health journey with our comprehensive platform.
        Track doctor visits, manage vaccinations, monitor test results, and
        maintain a complete record of your medical history all in one secure
        place.
      </p>

      <Features />
    </section>
  );
}
