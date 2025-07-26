import React from "react";
import { useNavigate } from "react-router-dom";
import "./BtnBack.scss";

export default function BtnBack() {
  const navigate = useNavigate();

  return (
    <button
      className="btn-back-arrow"
      onClick={() => navigate(-1)}
      aria-label="Go back"
    >
      ← Back
    </button>
  );
}
