import React from "react";
import "./ProfileStats.scss";

export default function ProfileStats() {
  const stats = [
    { value: 12, label: "Upcoming Events", color: "blue" },
    { value: 8, label: "Completed This Month", color: "green" },
    { value: 5, label: "Documents Uploaded", color: "purple" },
  ];

  return (
    <section className="profile-stats">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <h2 className={`stat-card__value ${stat.color}`}>{stat.value}</h2>
          <p className="stat-card__label">{stat.label}</p>
        </div>
      ))}
    </section>
  );
}
