import React from "react";
import { useNavigate } from "react-router-dom";
import "./BtnBack.scss";

export default function BtnBack({ disabled = false, to = "/" }) {
  const navigate = useNavigate();

  return (
    <button
      className="btn-back"
      onClick={() => navigate(to)}
      disabled={disabled}
      type="button"
    >
      ← Back
    </button>
  );
}
