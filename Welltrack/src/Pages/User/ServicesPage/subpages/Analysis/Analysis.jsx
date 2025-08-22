import React, { useState, useEffect } from "react";
import { FlaskConical, Plus, ChevronDown, Lightbulb } from "lucide-react";
import {
  addRecord,
  fetchAnalysisPackages,
  fetchAnalysisTests,
} from "../../../../../API/accounts";
import "./Analysis.scss";
import Swal from "sweetalert2";

import NavBar from "../../../components/NavBar/NavBar";
import Footer from "../../../components/Footer/Footer";

export default function AnalysisPage() {
  const [openSections, setOpenSections] = useState([]);
  const [showAdviceModal, setShowAdviceModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [testPackages, setTestPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [analysisTests, setAnalysisTests] = useState([]);

  const [testDate, setTestDate] = useState("");
  const [testTime, setTestTime] = useState("");
  const [errors, setErrors] = useState({});

  // Завантаження тестів з API
  useEffect(() => {
    const loadTests = async () => {
      try {
        const tests = await fetchAnalysisTests();
        setAnalysisTests(tests);
      } catch (error) {
        console.error("Failed to load analysis tests:", error);
      }
    };

    loadTests();
  }, []);

  // Завантаження пакетів з API
  useEffect(() => {
    const loadPackages = async () => {
      try {
        setLoading(true);
        const packages = await fetchAnalysisPackages();
        setTestPackages(packages);
      } catch (error) {
        console.error("Failed to load test packages:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load test packages. Please refresh the page.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadPackages();
  }, []);

  const toggleSection = (name) => {
    setOpenSections((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const validateField = (name, value) => {
    switch (name) {
      case "testDate": {
        if (!value.trim()) return "Date is required";
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
          return "Date cannot be in the past";
        }
        return "";
      }

      case "testTime": {
        if (!value.trim()) return "Time is required";
        const [hours, minutes] = value.split(":").map(Number);
        const timeInMinutes = hours * 60 + minutes;
        const minTime = 8 * 60;
        const maxTime = 18 * 60;

        if (timeInMinutes < minTime) {
          return "Time must be after 8:00 AM";
        }
        if (timeInMinutes > maxTime) {
          return "Time must be before 6:00 PM";
        }
        return "";
      }

      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "testDate") setTestDate(value);
    else if (name === "testTime") setTestTime(value);

    // Перевіряємо поле і оновлюємо помилки
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const validateForm = () => {
    const errs = {};
    errs.testDate = validateField("testDate", testDate);
    errs.testTime = validateField("testTime", testTime);

    // Фільтруємо порожні помилки
    Object.keys(errs).forEach((key) => !errs[key] && delete errs[key]);

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fix the errors before submitting.",
      });
      return;
    }

    if (!selectedPackage) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No package or test selected.",
      });
      return;
    }

    // Формуємо payload залежно від того, пакет чи індивідуальний тест
    const isSingleTest = selectedPackage.test.length === 1;

    const payload = {
      start_date: testDate,
      start_time: testTime,
      short_description: "", // або значення з форми
      ...(isSingleTest
        ? { analysis_test_id: selectedPackage.id } // індивідуальний тест
        : { analysis_package_id: selectedPackage.id }), // пакет
    };

    console.log("Payload to send:", payload);

    try {
      await addRecord(payload);

      Swal.fire({
        icon: "success",
        title: "Scheduled successfully!",
        showConfirmButton: false,
        timer: 2000,
      });

      closeAddModal();
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);

      const errorMessage =
        error.response?.data && typeof error.response.data === "object"
          ? Object.entries(error.response.data)
              .map(
                ([key, value]) =>
                  `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
              )
              .join("\n")
          : "Failed to schedule. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    }
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setSelectedPackage(null);
    setTestDate("");
    setTestTime("");
    setErrors({});
  };

  const openScheduleModal = (pkg) => {
    setSelectedPackage(pkg);
    setShowAddModal(true);
  };

  // Получаем минимальную дату (сегодня)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <>
      <NavBar />

      <div className="analysis">
        <header className="analysis__header">
          <div className="analysis__icon">
            <FlaskConical />
          </div>
          <h1 className="analysis__title">Analysis & Tests</h1>
          <p className="analysis__subtitle">
            Schedule medical tests and get personalized recommendations for your
            health screening
          </p>
        </header>

        <div className="analysis__actions">
          <button
            className="btn btn--primary"
            onClick={() => setShowAdviceModal(true)}
            type="button"
          >
            <Lightbulb className="icon" />
            Generate advice on scheduling tests
          </button>
        </div>

        {/* Advice Modal */}
        {showAdviceModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowAdviceModal(false)}
          >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Personalized Test Recommendations</h2>
              <p>
                Based on your age, health history, and risk factors, we
                recommend:
              </p>
              <ul>
                <li>Annual basic health screening</li>
                <li>Lipid panel every 2 years</li>
                <li>Diabetes screening if at risk</li>
                <li>Cancer screening based on age guidelines</li>
              </ul>
              <p className="note">
                Consult with your healthcare provider for personalized
                recommendations.
              </p>
              <button
                className="btn btn--primary"
                onClick={() => setShowAdviceModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Schedule Test Modal */}
        {showAddModal && selectedPackage && (
          <div className="modal-overlay" onClick={closeAddModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Schedule {selectedPackage.title}</h2>
              <p>Select date and time for your test appointment</p>

              <div className="package-info">
                <h4>Included Tests:</h4>
                <ul>
                  {selectedPackage.test.map((test) => (
                    <li key={test.id}>
                      <strong>{test.title}</strong>
                      <span> - {test.description}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <form onSubmit={handleSubmit} className="form" noValidate>
                <label>
                  Date <span className="required">*</span>
                  <input
                    type="date"
                    name="testDate"
                    value={testDate}
                    min={getMinDate()}
                    onChange={handleChange}
                    className={errors.testDate ? "error" : ""}
                    required
                    aria-invalid={!!errors.testDate}
                    aria-describedby="testDate-error"
                  />
                  {errors.testDate && (
                    <small id="testDate-error" className="error-msg">
                      {errors.testDate}
                    </small>
                  )}
                </label>

                <label>
                  Time <span className="required">*</span>
                  <input
                    type="time"
                    name="testTime"
                    value={testTime}
                    min="08:00"
                    max="18:00"
                    onChange={handleChange}
                    className={errors.testTime ? "error" : ""}
                    required
                    aria-invalid={!!errors.testTime}
                    aria-describedby="testTime-error"
                  />
                  {errors.testTime && (
                    <small id="testTime-error" className="error-msg">
                      {errors.testTime}
                    </small>
                  )}
                  <small className="help-text">
                    Available time: 8:00 AM - 6:00 PM
                  </small>
                </label>

                <div className="form-buttons">
                  <button className="btn btn--primary" type="submit">
                    Schedule Test
                  </button>
                  <button
                    className="btn btn--outline"
                    onClick={closeAddModal}
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Test Packages Accordion */}
        <section className="analysis__packages">
          <h2>Available Test Packages</h2>

          {loading ? (
            <div className="loading">Loading test packages...</div>
          ) : testPackages.length === 0 ? (
            <div className="no-packages">No test packages available</div>
          ) : (
            <div className="packages-list">
              {testPackages.map((pkg) => {
                const isOpen = openSections.includes(pkg.title);
                return (
                  <div className="package" key={pkg.id}>
                    <button
                      className={`package__header ${isOpen ? "open" : ""}`}
                      onClick={() => toggleSection(pkg.title)}
                      type="button"
                    >
                      <div>
                        <h3>{pkg.title}</h3>
                        <p>{pkg.test.length} tests included</p>
                      </div>
                      <ChevronDown
                        className={`icon-chevron ${isOpen ? "rotated" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="package__content">
                        <h4>Included Tests:</h4>
                        <ul>
                          {pkg.test.map((test) => (
                            <li key={test.id}>
                              <span className="dot" />
                              <div>
                                <strong>{test.title}</strong>
                                <p>{test.description}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                        <button
                          className="btn btn--primary btn--schedule"
                          onClick={() => openScheduleModal(pkg)}
                        >
                          <Plus className="icon" />
                          Schedule Package
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Individual Analysis Tests */}
              <section className="analysis__tests">
                <h2>Available Individual Tests</h2>

                {analysisTests.length === 0 ? (
                  <div className="no-tests">No tests available</div>
                ) : (
                  <div className="tests-list">
                    {analysisTests.map((test) => (
                      <div className="test-item" key={test.id}>
                        <h4>{test.title}</h4>
                        <p>{test.description}</p>
                        <button
                          className="btn btn--primary btn--schedule"
                          onClick={() => {
                            // відкриваємо модал з вибраним тестом
                            setSelectedPackage({
                              id: test.id,
                              title: test.title,
                              test: [test],
                            });
                            setShowAddModal(true);
                          }}
                        >
                          <Plus className="icon" /> Schedule Test
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </>
  );
}
