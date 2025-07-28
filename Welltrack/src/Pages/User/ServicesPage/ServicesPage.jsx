import React from "react";
import "./ServicesPage.scss";
import NavBar from "../components/NavBar/NavBar.jsx";
import Footer from "../components/Footer/Footer.jsx";
import ServicesPageCard from "./ServicesPageCard/ServicesPageCard.jsx";

export default function ServicesPage() {
  return (
    <>
      <NavBar />

      <section className="services-page">
        <div className="services-page__wrapper">
          <h1 className="services-page__title">Services</h1>
          <p className="services-page__description">
            Comprehensive healthcare services to help you manage every aspect of
            your medical journey
          </p>
        </div>
        
        <div className="services-page__cards">
          <ServicesPageCard />
        </div>
      </section>

      <Footer />
    </>
  );
}
