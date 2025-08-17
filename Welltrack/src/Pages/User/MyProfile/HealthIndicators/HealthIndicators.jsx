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
          return "Please enter your pulse";
        case "blood_pressure":
          return "Please enter your blood pressure";
        case "temperature":
          return "Please enter your temperature";
        case "weight":
          return "Please enter your weight";
        case "height":
          return "Please enter your height";
        default:
          return "This field is required";
      }
    }

    switch (field) {
      case "pulse": {
        const pulseNum = Number(value);
        if (isNaN(pulseNum)) return "Pulse must be a number";
        if (pulseNum < 30) return "Pulse cannot be less than 30 BPM"; // фізіологічний мінімум
        if (pulseNum > 220) return "Pulse cannot be more than 220 BPM"; // max при екстримальних навантаженнях
        break;
      }

      case "blood_pressure": {
        const bpNum = Number(value);
        if (isNaN(bpNum)) return "Blood pressure must be a number";
        if (bpNum < 50) return "Blood pressure cannot be less than 50 mmHg";
        if (bpNum > 250) return "Blood pressure cannot be more than 250 mmHg";
        break;
      }

      case "temperature": {
        const tempNum = Number(value);
        if (isNaN(tempNum)) return "Temperature must be a number";
        if (tempNum < 36.6) return "Temperature cannot be lower than 36.6°C"; // глибока гіпотермія
        if (tempNum > 45) return "Temperature cannot be higher than 45°C"; // несумісна з життям
        break;
      }

      case "weight": {
        const weightNum = Number(value);
        if (isNaN(weightNum)) return "Weight must be a number";
        if (weightNum < 20) return "Weight cannot be less than 20 kg";
        if (weightNum > 300) return "Weight cannot be more than 300 kg";
        break;
      }

      case "height": {
        const heightNum = Number(value);
        if (isNaN(heightNum)) return "Height must be a number";
        if (heightNum < 50) return "Height cannot be less than 50 cm";
        if (heightNum > 250) return "Height cannot be more than 250 cm";
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
    return { isValid: Object.keys(newErrors).length === 0, newErrors };
  };

  const handleSave = async () => {
    const { isValid, newErrors } = validateForm();

    if (!isValid) {
      const errorMessages = Object.values(newErrors).filter((msg) => msg);
      await Swal.fire({
        icon: "error",
        title: "Validation Errors",
        html: `<div style="text-align: left;">
      <p>Please fix the following errors:</p>
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
        title: "Data Saved!",
        text: "Your health indicators have been updated and recommendations generated",
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
        title: "Error",
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
