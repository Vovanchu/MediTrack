import React, { useState, useEffect } from "react";
import "./VaccinationPage.scss";

import { fetchVaccinations, addRecord } from "../../../../../API/accounts";

import NavBar from "../../../components/NavBar/NavBar";
import Footer from "../../../components/Footer/Footer";

function SimpleCalendar({ selectedDate, onChange }) {
  const [month, setMonth] = useState(selectedDate.getMonth());
  const [year, setYear] = useState(selectedDate.getFullYear());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = [...Array(daysInMonth).keys()].map((d) => d + 1);

  useEffect(() => {
    const newDate = new Date(year, month, selectedDate.getDate());
    if (onChange) onChange(newDate);
  }, [month, year]);

  function selectDay(day) {
    const newDate = new Date(year, month, day);
    onChange(newDate);
  }

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  }
  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  }

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={prevMonth}>&lt;</button>
        <span>
          {new Date(year, month).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button onClick={nextMonth}>&gt;</button>
      </div>
      <div className="calendar-days">
        {daysArray.map((day) => (
          <button
            key={day}
            className={`calendar-day ${
              selectedDate.getDate() === day &&
              selectedDate.getMonth() === month &&
              selectedDate.getFullYear() === year
                ? "selected"
                : ""
            }`}
            onClick={() => selectDay(day)}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function VaccinationPage() {
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("10:00");
  const [shortDescription, setShortDescription] = useState("");
  const [vaccinesFromDB, setVaccinesFromDB] = useState([]);

  const openModal = (vaccine) => {
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

  const handleAddEvent = async (e) => {
    e.preventDefault();

    const record = {
      vaccine_id: selectedVaccine.id,
      start_date: selectedDate.toISOString().split("T")[0], // 'YYYY-MM-DD'
      start_time: selectedTime, // 'HH:mm' саме з input time
      notes: shortDescription,
    };

    try {
      await addRecord(record);
      alert("Vaccination record added successfully!");
      closeModal();
    } catch (error) {
      console.error("Failed to add vaccination record", error);
      alert("Error: couldn't add record. Try again later.");
    }
  };

  useEffect(() => {
    async function getVaccines() {
      try {
        const response = await fetchVaccinations();
        setVaccinesFromDB(response.data);
      } catch (error) {
        console.error("Failed to fetch vaccines", error);
      }
    }

    getVaccines();
  }, []);

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
          <section className="vaccination-page__vaccine-list">
            <h2>Available Vaccines</h2>
            <div className="badges">
              {vaccinesFromDB.map((vaccine) => (
                <div
                  key={vaccine.id}
                  className="badge"
                  onClick={() => openModal(vaccine)}
                >
                  <strong>{vaccine.name}</strong>
                  <p>{vaccine.description?.substring(0, 60)}...</p>
                </div>
              ))}
            </div>
          </section>

          <section className="vaccination-page__calendar-section">
            <h2>Vaccination Calendar</h2>
            <p className="calendar-info">
              Approximate recommended ages for vaccinations:
            </p>
            <ul>
              {vaccinesFromDB.map((v) => (
                <li key={v.id}>
                  <strong>{v.name}:</strong> {v.recommendedAge || "N/A"}
                </li>
              ))}
            </ul>
            <SimpleCalendar
              selectedDate={selectedDate}
              onChange={setSelectedDate}
            />
          </section>
        </div>

        {modalOpen && selectedVaccine && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>{selectedVaccine.name}</h3>
              <p>{selectedVaccine.description}</p>
              <p className="info">{selectedVaccine.info}</p>

              <form onSubmit={handleAddEvent} className="event-form">
                <label>
                  Name of the event:
                  <input
                    type="text"
                    value={`Vaccination against ${selectedVaccine.name}`}
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
