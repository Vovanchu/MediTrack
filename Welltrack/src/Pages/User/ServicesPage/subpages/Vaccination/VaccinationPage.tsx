import React, { useState, useEffect } from "react";
import "./VaccinationPage.scss";

import Swal from "sweetalert2";

import { fetchVaccinations, addRecord } from "../../../../../API/accounts";

import NavBar from "../../../components/NavBar/NavBar";
import Footer from "../../../components/Footer/Footer";

import VaccinationTimeline from "@/assets/images/vaccination-timeline.jpg";

// ================= TYPES =================
interface Vaccine {
  id: number;
  title: string;
  slug: string;
  description: string;
  vaccine_info: string;
}

interface VaccinationRecord {
  vaccination_id: number;
  start_date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  short_description: string;
}

// ================= MAIN PAGE =================
export default function VaccinationPage() {
  const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("10:00");
  const [shortDescription, setShortDescription] = useState<string>("");
  const [vaccinesFromDB, setVaccinesFromDB] = useState<Vaccine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const openModal = (vaccine: Vaccine) => {
    setSelectedVaccine(vaccine);
    setShortDescription("");
    setSelectedTime("10:00");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedVaccine(null);
    setSelectedDate(new Date());
    setSelectedTime("10:00");
    setShortDescription("");
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    // === Валідація дати ===
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateOnly = new Date(selectedDate);
    selectedDateOnly.setHours(0, 0, 0, 0);

    if (selectedDateOnly < today) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date",
        text: "You cannot select a past date for a new vaccination record.",
      });
      return;
    }

    // === Валідація часу ===
    if (selectedDate && selectedTime) {
      const now = new Date();
      const selected = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(":").map(Number);
      selected.setHours(hours, minutes, 0, 0);

      if (hours < 8 || hours > 18 || (hours === 18 && minutes > 0)) {
        Swal.fire({
          icon: "error",
          title: "Invalid Time",
          text: "Vaccination appointments are allowed only between 08:00 and 18:00.",
        });
        return;
      }

      const todayCheck = new Date();
      if (
        selectedDate.toDateString() === todayCheck.toDateString() &&
        selected <= now
      ) {
        Swal.fire({
          icon: "error",
          title: "Invalid Date/Time",
          text: "You cannot select a time in the past.",
        });
        return;
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Date and Time Required",
        text: "Please select both a date and time for the vaccination.",
      });
      return;
    }

    const record: VaccinationRecord = {
      vaccination_id: selectedVaccine?.id as number,
      start_date: selectedDate.toISOString().split("T")[0],
      start_time: selectedTime,
      short_description: shortDescription || "",
    };

    try {
      await addRecord(record);
      Swal.fire({
        icon: "success",
        title: "Vaccination record added!",
        html: `
          <p><strong>Vaccine:</strong> ${selectedVaccine?.title}</p>
          <p><strong>Date:</strong> ${record.start_date}</p>
          <p><strong>Time:</strong> ${record.start_time}</p>
          ${
            record.short_description
              ? `<p><strong>Notes:</strong> ${record.short_description}</p>`
              : ""
          }
        `,
        confirmButtonText: "OK",
        timer: 5000,
      });
      closeModal();
    } catch (error) {
      console.error("Failed to add vaccination record", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Couldn't add record. Please try again later.",
      });
    }
  };

  useEffect(() => {
    async function getVaccines() {
      try {
        const response = await fetchVaccinations();
        setVaccinesFromDB(response.data as Vaccine[]);
      } catch (error) {
        console.error("Failed to fetch vaccines", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load vaccines. Please try refreshing the page.",
        });
      } finally {
        setLoading(false);
      }
    }

    getVaccines();
  }, []);

  if (loading) {
    return <p>Loading vaccines...</p>;
  }

  return (
    <>
      <NavBar />
      <div className="vaccination-page">
        <h1 className="vaccination-page__title">Vaccination</h1>
        <p className="vaccination-page__description">
          Stay protected with up-to-date vaccinations and track your
          immunization schedule
        </p>

        <div className="container">
          {/* Список вакцин */}
          <section className="vaccination-page__vaccine-list">
            <h2>Available Vaccines</h2>
            <div className="badges">
              {vaccinesFromDB.map((vaccine) => (
                <div
                  key={vaccine.id}
                  className="badge"
                  onClick={() => openModal(vaccine)}
                >
                  <strong>{vaccine.title}</strong>
                  <p>{vaccine.description?.substring(0, 60)}...</p>
                </div>
              ))}
            </div>
          </section>

          {/* Статична діаграма вакцинацій */}
          <section className="vaccination-page__timeline">
            <h2>Vaccination Timeline</h2>
            <p>Recommended vaccines throughout life:</p>
            <img
              src={VaccinationTimeline}
              alt="Vaccination Timeline"
              className="vaccination-timeline-img"
            />
          </section>
        </div>

        {/* Модальне вікно додавання події */}
        {modalOpen && selectedVaccine && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>{selectedVaccine.title}</h3>
              <p>{selectedVaccine.description}</p>
              <p className="info">{selectedVaccine.vaccine_info}</p>

              <form onSubmit={handleAddEvent} className="event-form">
                <label>
                  Name of the event:
                  <input
                    type="text"
                    value={`Vaccination against ${selectedVaccine.title}`}
                    readOnly
                  />
                </label>

                <label>
                  Choose date:
                  <input
                    type="date"
                    value={selectedDate.toISOString().split("T")[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    required
                  />
                </label>

                <label>
                  Choose time:
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                  />
                </label>

                <label>
                  Short description (optional):
                  <textarea
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Short description of the event"
                  />
                </label>

                <div className="modal-buttons">
                  <button type="submit" className="btn-primary">
                    Add to my events
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
