import React, { useState } from "react";
import { Plus, Bell, Trash2, Pill } from "lucide-react";
import NavBar from "../../../components/NavBar/NavBar";
import Footer from "../../../components/Footer/Footer";
import Swal from "sweetalert2";
import "./Medications.scss";

const MedicationsPage = () => {
  const [treatmentPlans, setTreatmentPlans] = useState([]);

  const [formData, setFormData] = useState({
    medicineName: "",
    description: "",
    startDate: "",
    finishDate: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.medicineName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Назва препарату обов'язкова",
        text: "Будь ласка, введіть назву препарату.",
      });
      return;
    }

    if (!formData.startDate) {
      Swal.fire({
        icon: "warning",
        title: "Дата початку обов'язкова",
        text: "Оберіть дату початку лікування.",
      });
      return;
    }

    if (!formData.intakeType) {
      Swal.fire({
        icon: "warning",
        title: "Виберіть тип прийому ліків",
        text: "Будь ласка, вкажіть, як часто приймати ліки.",
      });
      return;
    }

    const newPlan = {
      id: Date.now().toString(),
      ...formData,
    };

    setTreatmentPlans([...treatmentPlans, newPlan]);
    setFormData({
      medicineName: "",
      description: "",
      startDate: "",
      finishDate: "",
    });

    Swal.fire({
      icon: "success",
      title: "Додано успішно!",
      text: "Курс лікування було збережено.",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const deletePlan = (id) => {
    Swal.fire({
      title: "Видалити запис?",
      text: "Цю дію неможливо скасувати!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Так, видалити",
      cancelButtonText: "Скасувати",
    }).then((result) => {
      if (result.isConfirmed) {
        setTreatmentPlans(treatmentPlans.filter((plan) => plan.id !== id));
        Swal.fire("Видалено!", "Запис було успішно видалено.", "success");
      }
    });
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
                  value={formData.medicineName}
                  onChange={(e) =>
                    setFormData({ ...formData, medicineName: e.target.value })
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
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  Finish Date
                  <input
                    type="date"
                    value={formData.finishDate}
                    onChange={(e) =>
                      setFormData({ ...formData, finishDate: e.target.value })
                    }
                  />
                </label>
              </div>

              <label>
                Type of reception
                <select
                  value={formData.intakeType}
                  onChange={(e) =>
                    setFormData({ ...formData, intakeType: e.target.value })
                  }
                  required
                >
                  <option value="" disabled>
                    Select the type of reception
                  </option>
                  <option value="daily">Every day</option>
                  <option value="every_8_hours">Every 8 hours</option>
                  <option value="as_needed">As needed</option>
                  <option value="weekly">Every week</option>
                </select>
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
                        <h4>{plan.medicineName}</h4>
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
                        {new Date(plan.startDate).toLocaleDateString()}
                      </span>
                      {plan.finishDate && (
                        <span>
                          <strong>Кінець:</strong>{" "}
                          {new Date(plan.finishDate).toLocaleDateString()}
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
