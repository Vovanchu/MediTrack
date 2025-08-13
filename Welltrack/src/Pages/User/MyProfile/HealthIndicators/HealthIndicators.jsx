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
      const response = await fetchHealthIndicators();
      const data = response.data;

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
      } else {
        generateAndSetRecommendations(data);
      }
      setShowRecommendations(true);
    } catch (error) {
      console.error("Error fetching health indicators:", error);
    }
  }, []);

  useEffect(() => {
    loadHealthIndicators();
  }, [loadHealthIndicators]); // Added dependency

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

  const generateAndSetRecommendations = (data) => {
    const recs = [];

    // Pulse recommendations
    const pulse = parseInt(data.pulse);
    if (!isNaN(pulse)) {
      if (pulse < 60) {
        recs.push({
          title: "Low Pulse Alert",
          text: `Your pulse (${pulse} BPM) is below normal range (60–100). This could indicate bradycardia. Consider consulting a doctor.`,
          danger: true,
        });
      } else if (pulse > 100) {
        recs.push({
          title: "High Pulse Alert",
          text: `Your pulse (${pulse} BPM) is above normal range (60–100). This could indicate tachycardia. Consider consulting a doctor.`,
          danger: true,
        });
      } else {
        recs.push({
          title: "Pulse - Normal",
          text: `Your pulse (${pulse} BPM) is within the normal range. Great job maintaining good cardiovascular health!`,
        });
      }
    }

    // Blood Pressure recommendations
    const systolic = parseInt(data.blood_pressure);
    if (!isNaN(systolic)) {
      if (systolic < 90) {
        recs.push({
          title: "Low Blood Pressure Alert",
          text: `Your systolic blood pressure (${systolic} mmHg) is low. This may cause dizziness or fatigue. Stay hydrated and consider consulting a doctor.`,
          danger: true,
        });
      } else if (systolic > 140) {
        recs.push({
          title: "High Blood Pressure Alert",
          text: `Your systolic blood pressure (${systolic} mmHg) is elevated. This increases cardiovascular risks. Please monitor regularly and consult a doctor.`,
          danger: true,
        });
      } else if (systolic >= 120 && systolic <= 140) {
        recs.push({
          title: "Blood Pressure - Elevated",
          text: `Your systolic blood pressure (${systolic} mmHg) is slightly elevated. Consider lifestyle changes like reducing salt intake and regular exercise.`,
          danger: false,
        });
      } else {
        recs.push({
          title: "Blood Pressure - Optimal",
          text: `Your systolic blood pressure (${systolic} mmHg) is in the optimal range. Keep up the healthy lifestyle!`,
        });
      }
    }

    // Temperature recommendations
    const temperature = parseFloat(data.temperature);
    if (!isNaN(temperature)) {
      if (temperature < 36.0) {
        recs.push({
          title: "Low Body Temperature Alert",
          text: `Your temperature (${temperature}°C) is below normal. This could indicate hypothermia. Stay warm and monitor for symptoms.`,
          danger: true,
        });
      } else if (temperature > 37.5) {
        recs.push({
          title: "Fever Alert",
          text: `Your temperature (${temperature}°C) indicates fever. Rest, stay hydrated, and consider seeking medical attention if it persists.`,
          danger: true,
        });
      } else if (temperature > 37.2) {
        recs.push({
          title: "Slightly Elevated Temperature",
          text: `Your temperature (${temperature}°C) is slightly elevated. Monitor it and stay hydrated.`,
          danger: false,
        });
      } else {
        recs.push({
          title: "Temperature - Normal",
          text: `Your temperature (${temperature}°C) is normal. Your body is maintaining good thermal regulation.`,
        });
      }
    }

    // BMI calculations and recommendations
    const weight = parseFloat(data.weight);
    const height = parseFloat(data.height);
    if (!isNaN(weight) && !isNaN(height) && height > 0) {
      const heightM = height / 100;
      const bmi = weight / (heightM * heightM);

      if (bmi < 18.5) {
        recs.push({
          title: "BMI - Underweight",
          text: `Your BMI is ${bmi.toFixed(
            1
          )} (underweight). Consider consulting a nutritionist for a balanced diet plan to gain healthy weight.`,
          danger: true,
        });
      } else if (bmi >= 18.5 && bmi < 25) {
        recs.push({
          title: "BMI - Healthy Weight",
          text: `Your BMI is ${bmi.toFixed(
            1
          )} (healthy weight). You're maintaining an excellent weight for your height!`,
        });
      } else if (bmi >= 25 && bmi < 30) {
        recs.push({
          title: "BMI - Overweight",
          text: `Your BMI is ${bmi.toFixed(
            1
          )} (overweight). Consider incorporating regular exercise and a balanced diet to achieve a healthier weight.`,
          danger: false,
        });
      } else {
        recs.push({
          title: "BMI - Obesity Alert",
          text: `Your BMI is ${bmi.toFixed(
            1
          )} (obese). This significantly increases health risks. Please consult a healthcare provider for a comprehensive weight management plan.`,
          danger: true,
        });
      }
    }

    setRecommendations(recs);
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
      // Видаляємо невикористану змінну response і використовуємо деструктуризацію
      const { data } = await updateHealthIndicators({
        pulse: metrics.pulse ? Number(metrics.pulse) : null,
        blood_pressure: metrics.blood_pressure
          ? Number(metrics.blood_pressure)
          : null,
        temperature: metrics.temperature ? Number(metrics.temperature) : null,
        weight: metrics.weight ? Number(metrics.weight) : null,
        height: metrics.height ? Number(metrics.height) : null,
      });

      // Використовуємо data замість response
      if (data.recommendations) {
        setRecommendations(
          data.recommendations.map((rec) => ({
            title: "Рекомендація",
            text: rec,
            danger: /low|high|alert|fever|hypo|hyper/i.test(rec),
          }))
        );
      } else {
        generateAndSetRecommendations({
          pulse: metrics.pulse,
          blood_pressure: metrics.blood_pressure,
          temperature: metrics.temperature,
          weight: metrics.weight,
          height: metrics.height,
        });
      }

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
