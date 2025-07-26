import React from "react";
import { useNavigate } from "react-router-dom";
import featuresData from "./featuresData";
import "./Features.scss";

export default function Features() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <section className="features">
      {featuresData.map((feature, index) => (
        <div
          key={index}
          className="feature-card"
          onClick={handleClick}
          style={{ cursor: "pointer" }}
        >
          <div className="feature-card__image-wrapper">
            <img
              src={feature.image}
              alt={feature.title}
              className="feature-card__image"
            />
          </div>
          <h3 className="feature-card__title">{feature.title}</h3>
          <p className="feature-card__description">{feature.description}</p>
        </div>
      ))}
    </section>
  );
}
