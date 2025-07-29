import React, { useState } from "react";
import "./HealthIndicators.scss";
import NavBar from "../../components/NavBar/NavBar";
import BtnBack from "../../components/ui/BtnBack/BtnBack";
import Footer from "../../components/Footer/Footer";

export default function HealthIndicators() {
  const [metrics, setMetrics] = useState({
    pulse: "",
    bloodPressure: "",
    temperature: "",
    weight: "",
    height: "",
  });

  const [showRecommendations, setShowRecommendations] = useState(false);

  const handleChange = (field, value) => {
    setMetrics({ ...metrics, [field]: value });
  };

  const handleSave = () => {
    setShowRecommendations(true);
    alert("Health data saved!");
  };

  const generateRecommendations = () => {
    const recs = [];

    const pulse = parseInt(metrics.pulse);
    if (pulse) {
      if (pulse < 50 || pulse > 120) {
        recs.push({
          title: "Pulse Alert",
          text: "Your pulse is at a dangerous level. Seek medical attention.",
          danger: true,
        });
      } else {
        recs.push({
          title: "Heart Health",
          text: "Your pulse rate is within normal range. Continue regular exercise.",
        });
      }
    }

    const [systolic, diastolic] = metrics.bloodPressure
      .split("/")
      .map((v) => parseInt(v));
    if (systolic && diastolic) {
      if (systolic > 160 || diastolic > 100) {
        recs.push({
          title: "High Blood Pressure",
          text: "Your blood pressure is critically high. Please consult a doctor.",
          danger: true,
        });
      } else {
        recs.push({
          title: "Blood Pressure",
          text: "Excellent blood pressure reading! Keep up your healthy habits.",
        });
      }
    }

    const temperature = parseFloat(metrics.temperature);
    if (temperature) {
      if (temperature > 38) {
        recs.push({
          title: "High Temperature",
          text: "You have a fever. Monitor your condition and consult a doctor if needed.",
          danger: true,
        });
      } else {
        recs.push({
          title: "Body Temperature",
          text: "Normal body temperature. No concerns detected.",
        });
      }
    }

    const weight = parseFloat(metrics.weight);
    if (weight) {
      if (weight > 150) {
        recs.push({
          title: "Weight Alert",
          text: "Your weight is significantly above normal. Consult a nutritionist or doctor.",
          danger: true,
        });
      } else {
        recs.push({
          title: "Weight Management",
          text: "Consider tracking your weight weekly for better health monitoring.",
        });
      }
    }

    return recs;
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
                  />
                </li>
                <li>
                  <strong>Blood Pressure (mmHg)</strong>
                  <input
                    type="text"
                    value={metrics.bloodPressure}
                    onChange={(e) =>
                      handleChange("bloodPressure", e.target.value)
                    }
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
                  />
                </li>
                <li>
                  <strong>Weight (kg)</strong>
                  <input
                    type="number"
                    value={metrics.weight}
                    onChange={(e) => handleChange("weight", e.target.value)}
                  />
                </li>
                <li>
                  <strong>Height (sm)</strong>
                  <input
                    type="text"
                    value={metrics.height}
                    onChange={(e) => handleChange("height", e.target.value)}
                  />
                </li>
              </ul>
              <button className="btn-save" onClick={handleSave}>
                Save Health Data
              </button>
            </div>

            <div className="health-section">
              <h3 className="section-title">Health Recommendations</h3>
              {showRecommendations ? (
                <div className="recommendations">
                  {generateRecommendations().map((rec, index) => (
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
                <p className="recommendations-placeholder">
                  Save your data to see personalized tips.
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
