import React from "react";

import "./Body.scss";
import heart from "@/assets/images/heart.svg";
import Features from "./Features/Features";
import FAQ from "./FAQ/Faq";

export default function Body() {
  return (
    <section className="section_body">
      <img src={heart} alt="Heart Logo" className="section_body_image" />

      <h1 className="section_body_title">
        Welltrack — Health Records App to Track Your Wellness
      </h1>
      <p className="section_body_subtitle">
        Take control of your personal health records with our comprehensive
        medical records tracker. Manage doctor visits, vaccinations, test
        results, and medical history with one digital health record system.
      </p>

      <Features />

      <h2 className="section_body_heading">About Welltrack</h2>
      <p className="section_body_paragraph">
        Welltrack is an ambitious medical records tracking platform developed by
        a dedicated Ukrainian team for monitoring and managing health
        information. It takes care of all aspects of your wellness journey —
        from lab results to blood donations. The platform covers the 6 most
        important areas — doctor visits, vaccinations, lab tests, vitals, blood
        donations, and pills — to make sure you won’t miss anything important.
      </p>
      <p className="section_body_paragraph">
        Welltrack simplifies health management with intuitive tools that record
        vital signs, generate comprehensive health reports, and identify
        meaningful health trends over time.
      </p>

      <h2 className="section_body_heading">Why Register with Welltrack</h2>
      <ul className="section_body_list">
        <li>
          <span className="icon">✅</span>
          <span className="text">0 cases of data leak</span>
        </li>
        <li>
          <span className="icon">🎁</span>
          <span className="text">Free to use</span>
        </li>
        <li>
          <span className="icon">📂</span>
          <span className="text">1 platform for all your medical records</span>
        </li>
        <li>
          <span className="icon">🩺</span>
          <span className="text">Proactive care</span>
        </li>
      </ul>

      <h2 className="section_body_heading">Frequently Asked Questions</h2>
      <FAQ />
    </section>
  );
}
