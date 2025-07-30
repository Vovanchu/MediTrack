import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Body.scss";
import heart from "@/assets/images/heart.svg";
import Features from "@/Pages/Public/Main/components/Body/Features/Features";
import FAQ from "@/Pages/Public/Main/components/Body/FAQ/Faq";

const services = [
  "Doctor Visits",
  "Vaccinations",
  "Lab Tests",
  "Vitals Tracking",
  "Blood Donations",
  "Medications",
];

export default function Body() {
  const [query, setQuery] = useState("");

  const filteredServices = services.filter((service) =>
    service.toLowerCase().includes(query.toLowerCase())
  );

  const navigate = useNavigate();

  const handleServiceClick = (service) => {
    const route = `/services/${service.toLowerCase().replace(/\s+/g, "-")}`;
    navigate(route);
  };

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

      {/* === Search Bar === */}
      <div className="section_body_searchbar">
        <input
          type="text"
          placeholder="Search services..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <ul className="section_body_search-results">
            {filteredServices.length > 0 ? (
              filteredServices.map((service, index) => (
                <li key={index} onClick={() => handleServiceClick(service)}>
                  {service}
                </li>
              ))
            ) : (
              <li>No services found.</li>
            )}
          </ul>
        )}
      </div>

      <Features />

      <h2 className="section_body_heading">About Welltrack</h2>
      <p className="section_body_paragraph">
        Welltrack is an ambitious medical records tracking platform developed by
        a dedicated Ukrainian team for monitoring and managing health
        information...
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
