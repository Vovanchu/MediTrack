import React from "react";
import { Plus } from "lucide-react";
import "./ScheduleButton.scss"; // якщо стилі в окремому SCSS

export default function ScheduleButton({ onClick, children }) {
  return (
    <button className="schedule-button" onClick={onClick}>
      <Plus className="icon" />
      {children}
    </button>
  );
}
