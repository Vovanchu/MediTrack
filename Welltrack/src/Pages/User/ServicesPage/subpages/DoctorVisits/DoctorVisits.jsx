import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Heart, Plus } from "lucide-react";
import "./DoctorVisits.scss";
import NavBar from "../../../components/NavBar/NavBar";
import { fetchDoctorVisits, addRecord } from "../../../../../API/accounts";

export default function DoctorVisitPage() {
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Завантажуємо спеціальності з бекенду (GET)
  useEffect(() => {
    fetchDoctorVisits()
      .then((response) => {
        setSpecialties(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error loading specialties");
        setLoading(false);
      });
  }, []);

  const handleSelect = (specialty) => {
    setSelectedSpecialty(specialty);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSpecialty) {
      Swal.fire({
        icon: "error",
        title: "Select a specialty first!",
      });
      return;
    }

    const record = {
      title: `Doctor Visit: ${selectedSpecialty.title || selectedSpecialty}`,
      date: formData.date,
      time: formData.time,
      category: "doctor_visit",
      description: formData.notes,
      // Можна додати поле з id спеціальності, якщо потрібно:
      medical_specialty: selectedSpecialty.id || null,
    };

    try {
      const response = await addRecord(record);

      console.log("Backend response:", response);

      if (response && (response.status === 200 || response.status === 201)) {
        Swal.fire({
          icon: "success",
          title: "Appointment added!",
          html: `
            <p><strong>Specialty:</strong> ${
              selectedSpecialty.title || selectedSpecialty
            }</p>
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
      } else {
        console.error("Unexpected response status:", response.status);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Unexpected response from server.",
        });
      }
    } catch (error) {
      console.error("Failed to add doctor visit", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not add appointment. Try again later.",
      });
    }
  };

  if (loading) return <p>Loading specialties...</p>;
  if (error) return <p>Error loading specialties: {error}</p>;

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
            {specialties.map((specialty) => (
              <div
                key={specialty.id}
                className="doctor-visit__badge"
                onClick={() => handleSelect(specialty)}
              >
                {specialty.title}
              </div>
            ))}
          </div>
        </main>

        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Add Event: {selectedSpecialty.title || selectedSpecialty}</h2>
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
