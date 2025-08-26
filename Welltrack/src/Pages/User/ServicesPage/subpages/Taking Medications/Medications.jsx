import React, { useState, useEffect } from "react";
import { Plus, Bell, Trash2, Pill, AlertCircle } from "lucide-react";
import NavBar from "../../../components/NavBar/NavBar";
import Footer from "../../../components/Footer/Footer";
import Swal from "sweetalert2";
import "./Medications.scss";
import {
  addMedication,
  fetchMedications,
  deleteMedication,
} from "../../../../../API/accounts";

const MedicationsPage = () => {
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [formData, setFormData] = useState({
    name_of_medicine: "",
    description: "",
    start_date: "",
    finish_date: "",
    time_of_taking_medications: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch existing medications on mount
  useEffect(() => {
    const loadMedications = async () => {
      try {
        const data = await fetchMedications();
        console.log("Fetched medications:", data);
        setTreatmentPlans(data);
      } catch (error) {
        console.error("Fetch medications failed:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load treatment plans.",
        });
      }
    };
    loadMedications();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Name of medicine
    if (!formData.name_of_medicine || !formData.name_of_medicine.trim()) {
      newErrors.name_of_medicine = "Medicine name is required";
    } else if (formData.name_of_medicine.trim().length < 2) {
      newErrors.name_of_medicine =
        "Medicine name must be at least 2 characters";
    }

    // Description
    if (!formData.description || !formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 5) {
      newErrors.description = "Description must be at least 5 characters";
    }

    // Start date
    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    } else {
      const startDate = new Date(formData.start_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        newErrors.start_date = "Start date cannot be in the past";
      }
    }

    // Finish date
    if (!formData.finish_date) {
      newErrors.finish_date = "Finish date is required";
    } else {
      const startDate = new Date(formData.start_date);
      const finishDate = new Date(formData.finish_date);

      if (finishDate <= startDate) {
        newErrors.finish_date = "Finish date must be later than start date";
      }
    }

    // Time of taking medication
    if (!formData.time_of_taking_medications) {
      newErrors.time_of_taking_medications =
        "Time of taking medication is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const data = await addMedication(formData);
      setTreatmentPlans([...treatmentPlans, data]);
      setFormData({
        name_of_medicine: "",
        description: "",
        start_date: "",
        finish_date: "",
        time_of_taking_medications: "",
      });
      setErrors({});

      Swal.fire({
        icon: "success",
        title: "Added Successfully!",
        text: "The treatment plan has been saved.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Add medication failed:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save the treatment plan.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deletePlan = async (id) => {
    const result = await Swal.fire({
      title: "Delete this plan?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      try {
        await deleteMedication(id);
        setTreatmentPlans(treatmentPlans.filter((plan) => plan.id !== id));
        Swal.fire(
          "Deleted!",
          "The plan has been successfully deleted.",
          "success"
        );
      } catch (error) {
        console.error("Delete medication failed:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete the treatment plan.",
        });
      }
    }
  };

  const renderFieldError = (fieldName) => {
    if (errors[fieldName]) {
      return (
        <div className="medications__field-error">
          <AlertCircle size={14} />
          <span>{errors[fieldName]}</span>
        </div>
      );
    }
    return null;
  };

  // Функція для відображення часу приймання ліків
  const renderMedicationTimes = (plan) => {
    // Перевіряємо різні можливі формати часу
    let times = [];

    if (plan.times && Array.isArray(plan.times)) {
      times = plan.times;
    } else if (plan.time_of_taking_medications) {
      times = [plan.time_of_taking_medications];
    } else if (plan.times && typeof plan.times === "string") {
      times = [plan.times];
    }

    if (times.length === 0) {
      return "No time specified";
    }

    return times.join(", ");
  };

  return (
    <>
      <NavBar />
      <div className="medications">
        <header className="medications__header">
          <div className="medications__icon">
            <Pill size={60} strokeWidth={1.5} />
          </div>
          <h1>Treatment Plan</h1>
          <p>
            Manage your medications and treatment schedules with smart reminders
          </p>
        </header>

        <main className="medications__content">
          <section className="medications__form-section">
            <div className="medications__form-header">
              <h2>Add New Treatment</h2>
              <p className="medications__required-info">
                <span className="medications__required-mark">*</span> - required
                fields
              </p>
            </div>

            <form className="medications__form" onSubmit={handleSubmit}>
              <div className="medications__form-group">
                <label
                  className={`medications__label ${
                    errors.name_of_medicine ? "medications__label--error" : ""
                  }`}
                >
                  Medicine Name{" "}
                  <span className="medications__required-mark">*</span>
                </label>
                <input
                  type="text"
                  className={`medications__input ${
                    errors.name_of_medicine ? "medications__input--error" : ""
                  }`}
                  placeholder="e.g., Paracetamol, Aspirin..."
                  value={formData.name_of_medicine}
                  onChange={(e) =>
                    handleInputChange("name_of_medicine", e.target.value)
                  }
                />
                {renderFieldError("name_of_medicine")}
              </div>

              <div className="medications__form-group">
                <label
                  className={`medications__label ${
                    errors.description ? "medications__label--error" : ""
                  }`}
                >
                  Short Description{" "}
                  <span className="medications__required-mark">*</span>
                </label>
                <textarea
                  className={`medications__textarea ${
                    errors.description ? "medications__input--error" : ""
                  }`}
                  placeholder="Purpose, dosage, or notes..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows="3"
                />
                {renderFieldError("description")}
              </div>

              <div className="medications__form-dates">
                <div className="medications__form-group">
                  <label
                    className={`medications__label ${
                      errors.start_date ? "medications__label--error" : ""
                    }`}
                  >
                    Start Date{" "}
                    <span className="medications__required-mark">*</span>
                  </label>
                  <input
                    type="date"
                    className={`medications__input ${
                      errors.start_date ? "medications__input--error" : ""
                    }`}
                    value={formData.start_date}
                    onChange={(e) =>
                      handleInputChange("start_date", e.target.value)
                    }
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {renderFieldError("start_date")}
                </div>

                <div className="medications__form-group">
                  <label
                    className={`medications__label ${
                      errors.finish_date ? "medications__label--error" : ""
                    }`}
                  >
                    Finish Date
                    <span className="medications__required-mark">*</span>
                  </label>
                  <input
                    type="date"
                    className={`medications__input ${
                      errors.finish_date ? "medications__input--error" : ""
                    }`}
                    value={formData.finish_date}
                    onChange={(e) =>
                      handleInputChange("finish_date", e.target.value)
                    }
                    min={
                      formData.start_date ||
                      new Date().toISOString().split("T")[0]
                    }
                  />
                  {renderFieldError("finish_date")}
                </div>
              </div>

              <div className="medications__form-group">
                <label
                  className={`medications__label ${
                    errors.time_of_taking_medications
                      ? "medications__label--error"
                      : ""
                  }`}
                >
                  Time of Taking Medication{" "}
                  <span className="medications__required-mark">*</span>
                </label>
                <input
                  type="time"
                  className={`medications__input ${
                    errors.time_of_taking_medications
                      ? "medications__input--error"
                      : ""
                  }`}
                  value={formData.time_of_taking_medications}
                  onChange={(e) =>
                    handleInputChange(
                      "time_of_taking_medications",
                      e.target.value
                    )
                  }
                />
                {renderFieldError("time_of_taking_medications")}
              </div>

              <button
                type="submit"
                className={`medications__submit-btn ${
                  isSubmitting ? "medications__submit-btn--loading" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="medications__spinner"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus size={16} strokeWidth={2} />
                    Save Treatment Plan
                  </>
                )}
              </button>
            </form>
          </section>

          <section className="medications__plans-section">
            <div className="medications__plans-header">
              <h2>Current Treatment Plans</h2>
              <div className="medications__reminder">
                <Bell size={18} strokeWidth={2} />
                <span>Reminders Active</span>
              </div>
            </div>

            {treatmentPlans.length === 0 ? (
              <div className="medications__empty">
                <Pill size={40} strokeWidth={1.5} />
                <h3>No treatment plans yet</h3>
                <p>
                  Add your first treatment plan to start tracking your
                  medications
                </p>
              </div>
            ) : (
              <div className="medications__plan-list">
                {treatmentPlans.map((plan) => (
                  <div className="medications__plan" key={plan.id}>
                    <div className="medications__plan-header">
                      <div className="medications__plan-info">
                        <h4 className="medications__plan-name">
                          {plan.name_of_medicine}
                        </h4>
                        <p className="medications__plan-description">
                          {plan.description || "No description provided"}
                        </p>
                      </div>
                      <button
                        className="medications__delete-btn"
                        onClick={() => deletePlan(plan.id)}
                        title="Delete Treatment Plan"
                      >
                        <Trash2 size={18} strokeWidth={1.8} />
                      </button>
                    </div>

                    <div className="medications__plan-dates">
                      <span>
                        <strong>Start:</strong>{" "}
                        {new Date(plan.start_date).toLocaleDateString("en-US")}
                      </span>
                      {plan.finish_date && (
                        <span>
                          <strong>Finish:</strong>{" "}
                          {new Date(plan.finish_date).toLocaleDateString(
                            "en-US"
                          )}
                        </span>
                      )}
                      <span>
                        <strong>Time:</strong> {renderMedicationTimes(plan)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default MedicationsPage;
