import React from "react";
import { Link } from "react-router-dom";
import profileSections from "./ProfileSectionsData";
import "./ProfileSections.scss";

export default function ProfileSections() {
  return (
    <section className="profile-sections">
      <div className="profile-sections__grid">
        {profileSections.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link to={item.href} key={index} className="profile-card">
              {/* Додаємо клас кольору з даних */}
              <div className={`profile-card__icon ${item.color}`}>
                <Icon size={36} strokeWidth={1.5} />
              </div>
              <h3 className="profile-card__title">{item.title}</h3>
              <p className="profile-card__description">{item.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
