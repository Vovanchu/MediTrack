import React, { useState } from "react";
import Swal from "sweetalert2";
import { Heart, Plus } from "lucide-react";
import "./DoctorVisits.scss";
import NavBar from "../../../components/NavBar/NavBar";

export default function DoctorVisitPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    notes: "",
  });

  const specialties = [
    { name: "Cardiology" },
    { name: "Neurology" },
    { name: "Dermatology" },
    { name: "Orthopedics" },
    { name: "Pediatrics" },
    { name: "Gynecology" },
    { name: "Ophthalmology" },
    { name: "Psychiatry" },
  ];

  const handleSelect = (specialty) => {
    setSelectedSpecialty(specialty);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Тут можна додати логіку відправки даних на бек (поки що імітація)
    // Показуємо SweetAlert2
    Swal.fire({
      icon: "success",
      title: "Appointment added!",
      html: `
        <p><strong>Specialty:</strong> ${selectedSpecialty}</p>
        <p><strong>Date:</strong> ${formData.date}</p>
        <p><strong>Time:</strong> ${formData.time}</p>
        ${
          formData.notes
            ? `<p><strong>Notes:</strong> ${formData.notes}</p>`
            : ""
        }
      `,
      confirmButtonText: "OK",
      timer: 5000,
    });

    setIsModalOpen(false);
    setFormData({ date: "", time: "", notes: "" });
  };

  return (
    <>
      <NavBar />
      <div className="doctor-visit">
        <main className="doctor-visit__main">
          <div className="doctor-visit__header">
            <div className="doctor-visit__icon">
              <Heart className="doctor-visit__icon-heart" />
            </div>
            <h1 className="doctor-visit__title">Visit a Doctor</h1>
            <p className="doctor-visit__description">
              Choose a medical specialty to add an appointment
            </p>
          </div>

          <div className="doctor-visit__grid">
            {specialties.map((specialty, index) => (
              <div
                key={index}
                className="doctor-visit__badge"
                onClick={() => handleSelect(specialty.name)}
              >
                {specialty.name}
              </div>
            ))}
          </div>
        </main>

        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Add Event: {selectedSpecialty}</h2>
              <form onSubmit={handleSubmit} className="modal-form">
                <label>
                  Date:
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Time:
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Notes:
                  <textarea
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Optional notes..."
                  />
                </label>
                <button type="submit" className="btn-submit">
                  <Plus className="btn-icon" /> Add to My Events
                </button>
              </form>
              <button
                className="btn-close"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
