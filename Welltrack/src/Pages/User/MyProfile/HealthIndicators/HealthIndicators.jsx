import React, { useState, useEffect, useCallback } from "react";
import "./HealthIndicators.scss";
import NavBar from "../../components/NavBar/NavBar";
import BtnBack from "../../components/ui/BtnBack/BtnBack";
import Footer from "../../components/Footer/Footer";
import Swal from "sweetalert2";
import {
  fetchHealthIndicators,
  updateHealthIndicators,
} from "../../../../API/accounts";

export default function HealthIndicators() {
  const [metrics, setMetrics] = useState({
    pulse: "",
    blood_pressure: "",
    temperature: "",
    weight: "",
    height: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const loadHealthIndicators = useCallback(async () => {
    try {
      const response = await fetchHealthIndicators(7);
      const data = response.data[0]; // <-- важливо

      setMetrics({
        pulse: data.pulse || "",
        blood_pressure: data.blood_pressure || "",
        temperature: data.temperature || "",
        weight: data.weight || "",
        height: data.height || "",
      });

      if (data.recommendations && Array.isArray(data.recommendations)) {
        setRecommendations(
          data.recommendations.map((rec) => ({
            title: "Recommendation",
            text: rec,
            danger: /low|high|alert|fever|hypo|hyper/i.test(rec),
          }))
        );
      }
      setShowRecommendations(true);
    } catch (error) {
      console.error("Error fetching health indicators:", error);
    }
  }, []);

  useEffect(() => {
    loadHealthIndicators();
  }, [loadHealthIndicators]);

  const validateField = (field, value) => {
    if (!value || value.toString().trim() === "") {
      switch (field) {
        case "pulse":
          return "Будь ласка, введіть ваш пульс";
        case "blood_pressure":
          return "Будь ласка, введіть ваш тиск";
        case "temperature":
          return "Будь ласка, введіть вашу температуру";
        case "weight":
          return "Будь ласка, введіть вашу вагу";
        case "height":
          return "Будь ласка, введіть ваш зріст";
        default:
          return "Це поле обов'язкове для заповнення";
      }
    }

    switch (field) {
      case "pulse": {
        const pulseNum = Number(value);
        if (isNaN(pulseNum)) return "Пульс має бути числом";
        if (pulseNum < 30) return "Пульс не може бути менше 30 уд/хв";
        if (pulseNum > 220) return "Пульс не може бути більше 220 уд/хв";
        break;
      }

      case "blood_pressure": {
        const bpNum = Number(value);
        if (isNaN(bpNum)) return "Тиск має бути числом";
        if (bpNum < 50) return "Тиск не може бути менше 50 мм рт.ст.";
        if (bpNum > 250) return "Тиск не може бути більше 250 мм рт.ст.";
        break;
      }

      case "temperature": {
        const tempNum = Number(value);
        if (isNaN(tempNum)) return "Температура має бути числом";
        if (tempNum < 30) return "Температура не може бути нижчою за 30°C";
        if (tempNum > 45) return "Температура не може бути вищою за 45°C";
        break;
      }

      case "weight": {
        const weightNum = Number(value);
        if (isNaN(weightNum)) return "Вага має бути числом";
        if (weightNum < 20) return "Вага не може бути меншою за 20 кг";
        if (weightNum > 300) return "Вага не може бути більшою за 300 кг";
        break;
      }

      case "height": {
        const heightNum = Number(value);
        if (isNaN(heightNum)) return "Зріст має бути числом";
        if (heightNum < 50) return "Зріст не може бути меншим за 50 см";
        if (heightNum > 250) return "Зріст не може бути більшим за 250 см";
        break;
      }
    }

    return "";
  };

  const handleChange = (field, value) => {
    setMetrics((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(metrics).forEach((field) => {
      const error = validateField(field, metrics[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      const errorMessages = Object.values(errors).filter((msg) => msg);
      await Swal.fire({
        icon: "error",
        title: "Помилки валідації",
        html: `<div style="text-align: left;">
        <p>Будь ласка, виправте наступні помилки:</p>
        <ul>${errorMessages.map((msg) => `<li>${msg}</li>`).join("")}</ul>
      </div>`,
        confirmButtonColor: "#3b82f6",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await updateHealthIndicators({
        pulse: metrics.pulse ? Number(metrics.pulse) : null,
        blood_pressure: metrics.blood_pressure
          ? Number(metrics.blood_pressure)
          : null,
        temperature: metrics.temperature ? Number(metrics.temperature) : null,
        weight: metrics.weight ? Number(metrics.weight) : null,
        height: metrics.height ? Number(metrics.height) : null,
      });

      console.log("API response:", response);

      const data = response.data ?? response;
      console.log("Extracted data:", data);

      let recs = [];
      if (Array.isArray(data.recommendations)) {
        recs = data.recommendations;
      } else if (data.recommendations) {
        recs = [data.recommendations];
      }

      console.log("API raw recommendations:", data.recommendations);

      setRecommendations(
        recs.map((rec) => ({
          title: "Recommendation",
          text: rec,
          danger: /low|high|alert|fever|hypo|hyper/i.test(rec),
        }))
      );
      setShowRecommendations(true);

      await Swal.fire({
        icon: "success",
        title: "Дані збережено!",
        text: "Ваші показники оновлено та рекомендації сформовано",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Помилка збереження:", error);
      let errorMessage = "Не вдалося зберегти дані";

      if (error.response?.data) {
        errorMessage = Object.entries(error.response.data)
          .map(
            ([field, errors]) =>
              `${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`
          )
          .join("\n");
      }

      await Swal.fire({
        icon: "error",
        title: "Помилка",
        text: errorMessage,
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <section className="health-indicators">
        <div className="health-indicators__container">
          <div className="health-header">
            <div className="health-header__text">
              <h2 className="page-title">Health Indicators</h2>
              <p className="page-description">
                Track your vital signs and get personalized tips
              </p>
            </div>
            <BtnBack />
          </div>

          <div className="health-sections-wrapper">
            <div className="health-section">
              <h3 className="section-title">Current Health Metrics</h3>
              <ul className="metrics-list">
                <li>
                  <strong>Pulse (BPM)</strong>
                  <input
                    type="number"
                    value={metrics.pulse}
                    onChange={(e) => handleChange("pulse", e.target.value)}
                    className={errors.pulse ? "error" : ""}
                    placeholder="Enter your pulse rate"
                  />
                </li>

                <li>
                  <strong>Blood Pressure (systolic, mmHg)</strong>
                  <input
                    type="number"
                    value={metrics.blood_pressure}
                    onChange={(e) =>
                      handleChange("blood_pressure", e.target.value)
                    }
                    className={errors.blood_pressure ? "error" : ""}
                    placeholder="Enter systolic pressure (e.g., 120)"
                  />
                </li>

                <li>
                  <strong>Temperature (°C)</strong>
                  <input
                    type="number"
                    step="0.1"
                    value={metrics.temperature}
                    onChange={(e) =>
                      handleChange("temperature", e.target.value)
                    }
                    className={errors.temperature ? "error" : ""}
                    placeholder="Enter your temperature"
                  />
                </li>

                <li>
                  <strong>Weight (kg)</strong>
                  <input
                    type="number"
                    step="0.1"
                    value={metrics.weight}
                    onChange={(e) => handleChange("weight", e.target.value)}
                    className={errors.weight ? "error" : ""}
                    placeholder="Enter your weight"
                  />
                </li>

                <li>
                  <strong>Height (cm)</strong>
                  <input
                    type="number"
                    step="0.1"
                    value={metrics.height}
                    onChange={(e) => handleChange("height", e.target.value)}
                    className={errors.height ? "error" : ""}
                    placeholder="Enter your height"
                  />
                </li>
              </ul>

              <button
                className="btn-save"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Health Data"}
              </button>
            </div>

            <div className="health-section">
              <h3 className="section-title">Health Recommendations</h3>
              {showRecommendations && recommendations.length > 0 ? (
                <div className="recommendations">
                  {recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className={`recommendation-card ${
                        rec.danger ? "danger" : ""
                      }`}
                    >
                      <h4>{rec.title}</h4>
                      <p>{rec.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-recommendations">
                  {loading
                    ? "Завантаження..."
                    : "Немає рекомендацій для відображення"}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
