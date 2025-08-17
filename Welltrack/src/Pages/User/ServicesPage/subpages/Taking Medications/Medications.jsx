import React, { useState, useEffect } from "react";
import { Plus, Bell, Trash2, Pill } from "lucide-react";
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

  // Fetch existing medications on mount
  useEffect(() => {
    const loadMedications = async () => {
      try {
        const data = await fetchMedications();
        setTreatmentPlans(data);
      } catch (error) {
        console.error("Fetch medications failed:", error);
        Swal.fire({
          icon: "error",
          title: "Помилка",
          text: "Не вдалося завантажити плани лікування.",
        });
      }
    };
    loadMedications();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      { key: "name_of_medicine", label: "Назва препарату" },
      { key: "start_date", label: "Дата початку" },
      { key: "time_of_taking_medications", label: "Час прийому" },
    ];

    for (let field of requiredFields) {
      if (!formData[field.key] || !formData[field.key].trim()) {
        Swal.fire({
          icon: "warning",
          title: `${field.label} обов'язкова`,
          text: `Будь ласка, заповніть ${field.label.toLowerCase()}.`,
        });
        return;
      }
    }

    try {
      const data = await addMedication(formData); // POST на сервер
      setTreatmentPlans([...treatmentPlans, data]); // додаємо отриманий запис
      setFormData({
        name_of_medicine: "",
        description: "",
        start_date: "",
        finish_date: "",
        time_of_taking_medications: "",
      });

      Swal.fire({
        icon: "success",
        title: "Додано успішно!",
        text: "Курс лікування було збережено.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Add medication failed:", error);
      Swal.fire({
        icon: "error",
        title: "Помилка",
        text: "Не вдалося зберегти курс лікування.",
      });
    }
  };

  const deletePlan = async (id) => {
    const result = await Swal.fire({
      title: "Видалити запис?",
      text: "Цю дію неможливо скасувати!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Так, видалити",
      cancelButtonText: "Скасувати",
    });

    if (result.isConfirmed) {
      try {
        await deleteMedication(id); // видалення на сервері
        setTreatmentPlans(treatmentPlans.filter((plan) => plan.id !== id));
        Swal.fire("Видалено!", "Запис було успішно видалено.", "success");
      } catch (error) {
        console.error("Delete medication failed:", error);
        Swal.fire({
          icon: "error",
          title: "Помилка",
          text: "Не вдалося видалити курс лікування.",
        });
      }
    }
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
            <h2>Add New Treatment</h2>
            <form className="medications__form" onSubmit={handleSubmit}>
              <label>
                Name of Medicine
                <input
                  type="text"
                  placeholder="e.g., Paracetamol"
                  value={formData.name_of_medicine}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name_of_medicine: e.target.value,
                    })
                  }
                  required
                />
              </label>

              <label>
                Short Description
                <textarea
                  placeholder="Purpose, dosage, or notes..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </label>

              <div className="medications__form-dates">
                <label>
                  Start Date
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  Finish Date
                  <input
                    type="date"
                    value={formData.finish_date}
                    onChange={(e) =>
                      setFormData({ ...formData, finish_date: e.target.value })
                    }
                  />
                </label>
              </div>

              <label>
                Time of taking medication
                <input
                  type="time"
                  value={formData.time_of_taking_medications}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      time_of_taking_medications: e.target.value,
                    })
                  }
                  required
                />
              </label>

              <button type="submit">
                <Plus size={16} strokeWidth={2} /> Save Treatment Plan
              </button>
            </form>
          </section>

          <section className="medications__plans-section">
            <div className="medications__plans-header">
              <h2>Current Treatments</h2>
              <div className="medications__reminder">
                <Bell size={18} strokeWidth={2} />
                <span>Reminders Active</span>
              </div>
            </div>

            {treatmentPlans.length === 0 ? (
              <div className="medications__empty">
                <Pill size={40} strokeWidth={1.5} />
                <h3>No treatments yet</h3>
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
                      <div>
                        <h4>{plan.name_of_medicine}</h4>
                        <p>{plan.description || "Опис відсутній"}</p>
                      </div>
                      <button
                        onClick={() => deletePlan(plan.id)}
                        title="Видалити"
                      >
                        <Trash2 size={18} strokeWidth={1.8} />
                      </button>
                    </div>
                    <div className="medications__plan-dates">
                      <span>
                        <strong>Початок:</strong>{" "}
                        {new Date(plan.start_date).toLocaleDateString()}
                      </span>
                      {plan.finish_date && (
                        <span>
                          <strong>Кінець:</strong>{" "}
                          {new Date(plan.finish_date).toLocaleDateString()}
                        </span>
                      )}
                      {plan.times && plan.times.length > 0 && (
                        <span>
                          <strong>Час прийому:</strong> {plan.times.join(", ")}
                        </span>
                      )}
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
