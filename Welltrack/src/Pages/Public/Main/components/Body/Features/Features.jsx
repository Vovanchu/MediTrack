import React from "react";
import featuresData from "./featuresData";
import "./Features.scss";
import { Link } from "react-router-dom";

export default function Features() {
  return (
    <section className="features">
      {featuresData.map((feature, index) => (
        <Link to={feature.href} key={index} className="feature-card">
          <div className="feature-card__image-wrapper">
            <img src={feature.image} alt={feature.title} className="feature-card__image" />
          </div>
          <h3 className="feature-card__title">{feature.title}</h3>
          <p className="feature-card__description">{feature.description}</p>
        </Link>
      ))}
    </section>
  );
}
