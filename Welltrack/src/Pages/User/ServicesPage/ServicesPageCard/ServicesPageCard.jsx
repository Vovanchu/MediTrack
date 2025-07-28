import React from "react";
import { useNavigate, Link } from "react-router-dom";
import servicesData from "./ServicesPageCardData.js";
import "./ServicesPageCard.scss";

export default function ServicesPageCard() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/services"); 
  };

  return (
    <section className="services">
      {servicesData.map((service, index) => (
        <Link
          to={service.href}
          key={index}
          className="services-card"
          onClick={handleClick}
          style={{ cursor: "pointer" }}
        >
          <div className="services-card__image-wrapper">
            <img
              src={service.image}
              alt={service.title}
              className="services-card__image"
            />
          </div>
          <h3 className="services-card__title">{service.title}</h3>
          <p className="services-card__description">{service.description}</p>
        </Link>
      ))}
    </section>
  );
}
