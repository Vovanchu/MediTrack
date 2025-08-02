import React, { useState } from "react";
import { FlaskConical, Plus, ChevronDown, Lightbulb } from "lucide-react";
import { addRecord } from "../../../../../API/accounts";
import "./Analysis.scss";
import Swal from "sweetalert2";

import NavBar from "../../../components/NavBar/NavBar";
import Footer from "../../../components/Footer/Footer";
import testPackages from "./testPackagesData";

export default function AnalysisPage() {
  const [openSections, setOpenSections] = useState([]);
  const [showAdviceModal, setShowAdviceModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [testName, setTestName] = useState("");
  const [testDate, setTestDate] = useState("");
  const [testNotes, setTestNotes] = useState("");
  const [errors, setErrors] = useState({});

  const toggleSection = (name) => {
    setOpenSections((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const validateField = (name, value) => {
    switch (name) {
      case "testName":
        if (!value.trim()) return "Test Name is required";
        return "";
      case "testDate":
        if (!value.trim()) return "Date is required";
        // Додатково можна перевірити дату, наприклад, що дата не в минулому
        if (new Date(value) < new Date().setHours(0, 0, 0, 0))
          return "Date cannot be in the past";
        return "";
      default:
        return "";
    }
  };

  // Оновлення стану і валідації при зміні поля
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Оновлюємо відповідний стейт
    if (name === "testName") setTestName(value);
    else if (name === "testDate") setTestDate(value);
    else if (name === "testNotes") setTestNotes(value);

    // Перевіряємо поле і оновлюємо помилки
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const validateForm = () => {
    const errs = {};
    errs.testName = validateField("testName", testName);
    errs.testDate = validateField("testDate", testDate);

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

    try {
      await addRecord({
        testName,
        testDate,
        testNotes,
      });

      Swal.fire({
        icon: "success",
        title: "Event saved!",
        showConfirmButton: false,
        timer: 2000,
      });

      setTestName("");
      setTestDate("");
      setTestNotes("");
      setErrors({});
      setShowAddModal(false);
    } catch (error) {
      console.error("API Error:", error.response || error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while saving the event!",
      });
    }
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setTestName("");
    setTestDate("");
    setTestNotes("");
    setErrors({});
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

          <button
            className="btn btn--outline"
            onClick={() => setShowAddModal(true)}
            type="button"
          >
            <Plus className="icon" />
            Add to my events
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

        {/* Add Event Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={closeAddModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>New Test Event</h2>
              <p>Add a new medical test or analysis to your calendar</p>

              <form onSubmit={handleSubmit} className="form" noValidate>
                <label>
                  Test Name <span className="required">*</span>
                  <input
                    type="text"
                    name="testName"
                    value={testName}
                    onChange={handleChange}
                    className={errors.testName ? "error" : ""}
                    required
                    aria-invalid={!!errors.testName}
                    aria-describedby="testName-error"
                  />
                  {errors.testName && (
                    <small id="testName-error" className="error-msg">
                      {errors.testName}
                    </small>
                  )}
                </label>

                <label>
                  Date <span className="required">*</span>
                  <input
                    type="date"
                    name="testDate"
                    value={testDate}
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
                  Notes
                  <textarea
                    name="testNotes"
                    value={testNotes}
                    onChange={handleChange}
                  />
                </label>

                <button className="btn btn--primary" type="submit">
                  Save Event
                </button>
              </form>

              <button
                className="btn btn--outline modal-close-btn"
                onClick={closeAddModal}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Test Packages Accordion */}
        <section className="analysis__packages">
          <h2>Screening Test Packages</h2>
          <div className="packages-list">
            {testPackages.map((pkg, i) => {
              const isOpen = openSections.includes(pkg.name);
              return (
                <div className="package" key={i}>
                  <button
                    className={`package__header ${isOpen ? "open" : ""}`}
                    onClick={() => toggleSection(pkg.name)}
                    type="button"
                  >
                    <div>
                      <h3>{pkg.name}</h3>
                      <p>{pkg.description}</p>
                    </div>
                    <ChevronDown
                      className={`icon-chevron ${isOpen ? "rotated" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="package__content">
                      <h4>Included Tests:</h4>
                      <ul>
                        {pkg.tests.map((test, idx) => (
                          <li key={idx}>
                            <span className="dot" />
                            {test}
                          </li>
                        ))}
                      </ul>
                      <button
                        className="btn btn--primary btn--schedule"
                        onClick={() => {
                          setTestName(pkg.name);
                          setShowAddModal(true);
                        }}
                      >
                        <Plus className="icon" />
                        Schedule Package
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
