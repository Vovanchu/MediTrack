import React, { useState, useEffect } from "react";
import "./VaccinationPage.scss";

import { addRecord } from "@/API/accounts";

import NavBar from "../../../components/NavBar/NavBar";
import Footer from "../../../components/Footer/Footer";

const vaccines = [
  {
    name: "Influenza (Flu)",
    description:
      "Annual vaccination to protect against seasonal influenza viruses. Recommended for everyone 6 months and older.",
    info: "The flu vaccine is updated annually to protect against the strains most likely to spread during the upcoming season.",
    recommendedAge: "6 months and older",
  },
  {
    name: "COVID-19",
    description:
      "Vaccination to protect against coronavirus disease 2019. Includes initial series and boosters as recommended.",
    info: "COVID-19 vaccines help protect against severe illness, hospitalization, and death from COVID-19.",
    recommendedAge: "All ages (as recommended)",
  },
  {
    name: "Measles, Mumps, Rubella (MMR)",
    description:
      "Combined vaccine protecting against three serious viral infections. Usually given in childhood with boosters.",
    info: "MMR vaccine provides long-lasting protection against measles, mumps, and rubella (German measles).",
    recommendedAge: "12-15 months (1st dose), 4-6 years (2nd dose)",
  },
  {
    name: "Tetanus, Diphtheria, Pertussis (Tdap)",
    description:
      "Protects against tetanus, diphtheria, and whooping cough. Booster recommended every 10 years.",
    info: "Tdap vaccine is especially important for adults who will be around babies to prevent whooping cough transmission.",
    recommendedAge: "Booster every 10 years",
  },
  {
    name: "Hepatitis B",
    description:
      "Protects against hepatitis B virus infection which can cause liver disease. Usually given as a series.",
    info: "Hepatitis B vaccine provides long-term protection against hepatitis B virus infection and liver cancer.",
    recommendedAge: "Birth, 1-2 months, 6-18 months",
  },
  {
    name: "Pneumococcal",
    description:
      "Protects against pneumococcal disease including pneumonia and meningitis. Recommended for certain age groups.",
    info: "Pneumococcal vaccines help prevent serious infections caused by pneumococcus bacteria.",
    recommendedAge: "Children under 2, adults 65+",
  },
];

function SimpleCalendar({ selectedDate, onChange }) {
  const [month, setMonth] = useState(selectedDate.getMonth());
  const [year, setYear] = useState(selectedDate.getFullYear());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = [...Array(daysInMonth).keys()].map((d) => d + 1);

  useEffect(() => {
    const newDate = new Date(year, month, selectedDate.getDate());
    if (onChange) onChange(newDate);
    // eslint-disable-next-line
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
        <button onClick={prevMonth} aria-label="Previous month">
          &lt;
        </button>
        <span>
          {new Date(year, month).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button onClick={nextMonth} aria-label="Next month">
          &gt;
        </button>
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
            aria-current={
              selectedDate.getDate() === day &&
              selectedDate.getMonth() === month &&
              selectedDate.getFullYear() === year
                ? "date"
                : undefined
            }
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
  const [eventName, setEventName] = useState("");

  const openModal = (vaccine) => {
    setSelectedVaccine(vaccine);
    setEventName(`Vaccination against ${vaccine.name}`);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedVaccine(null);
    setSelectedDate(new Date());
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();

    const record = {
      title: eventName,
      date: selectedDate.toISOString().split("T")[0], // YYYY-MM-DD
      category: "vaccination", // якщо є категорії на бекенді
      description: selectedVaccine.description,
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
              {vaccines.map((vaccine, idx) => (
                <div
                  key={idx}
                  className="badge"
                  onClick={() => openModal(vaccine)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") openModal(vaccine);
                  }}
                >
                  <strong>{vaccine.name}</strong>
                  <p>{vaccine.description.substring(0, 60)}...</p>
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
              {vaccines.map((v) => (
                <li key={v.name}>
                  <strong>{v.name}:</strong> {v.recommendedAge}
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
            <div
              className="modal"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              <h3 id="modal-title">{selectedVaccine.name}</h3>
              <p>{selectedVaccine.description}</p>
              <p className="info">{selectedVaccine.info}</p>

              <form onSubmit={handleAddEvent} className="event-form">
                <label>
                  Name of the event:
                  <input
                    type="text"
                    value={eventName}
                    readOnly
                    className="event-name-input"
                  />
                </label>

                <label>
                  Choose date:
                  <input
                    type="date"
                    value={selectedDate.toISOString().substring(0, 10)}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    required
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
