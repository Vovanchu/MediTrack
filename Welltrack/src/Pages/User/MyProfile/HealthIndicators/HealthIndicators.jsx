import React, { useState } from "react";
import "./HealthIndicators.scss";
import NavBar from "../../components/NavBar/NavBar";
import BtnBack from "../../components/BtnBack/BtnBack";
import Footer from "../../components/Footer/Footer";

export default function HealthIndicators() {
  const [metrics, setMetrics] = useState({
    pulse: "72",
    bloodPressure: "120/80",
    temperature: "98.6",
    weight: "150",
    height: "5'8\"",
  });

  const handleChange = (field, value) => {
    setMetrics({ ...metrics, [field]: value });
  };

  const handleSave = () => {
    console.log("Saving health metrics:", metrics);
    alert("Health data saved!");
  };

  return (
    <>
      <NavBar />

      <section
        className="health-indicators"
        style={{ backgroundColor: "#e6f2ff" }}
      >
        <div className="health-indicators__container">
          {/* Заголовок з кнопкою Назад */}
          <div className="health-header">
            <div className="health-header__text">
              <h2 className="page-title">Health Indicators</h2>
              <p className="page-description">
                Track your vital signs and health metrics
              </p>
            </div>

            <BtnBack />
          </div>

          {/* Дві колонки */}
          <div className="health-sections-wrapper">
            {/* Ліва колонка */}
            <div className="health-section">
              <h3 className="section-title">Current Health Metrics</h3>
              <p>Enter your latest health measurements</p>
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
                  <strong>Temperature (°F)</strong>
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
                  <strong>Weight (lbs)</strong>
                  <input
                    type="number"
                    value={metrics.weight}
                    onChange={(e) => handleChange("weight", e.target.value)}
                  />
                </li>
                <li>
                  <strong>Height</strong>
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

            {/* Права колонка */}
            <div className="health-section">
              <h3 className="section-title">Health Trends</h3>
              <ul className="trends-list">
                <li>
                  <strong>Average Pulse</strong> <span>74 BPM</span>
                </li>
                <li>
                  <strong>Blood Pressure Trend</strong> <span>Stable</span>
                </li>
                <li>
                  <strong>Weight Change</strong> <span>-2 lbs this month</span>
                </li>
              </ul>

              <div className="tips-block">
                <h3 className="tips-title">Health Monitoring Tips</h3>
                <ul className="tips-list">
                  <li>
                    Take measurements at the same time each day for consistency
                  </li>
                  <li>
                    Rest for 5 minutes before taking blood pressure readings
                  </li>
                  <li>
                    Weigh yourself without clothes for accurate measurements
                  </li>
                  <li>Consult your doctor if you notice significant changes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
