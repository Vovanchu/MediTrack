import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { fetchRecords, addRecord, deleteRecord } from "../../../API/accounts";
import "./MyEvents.scss";

import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";

const EVENT_TYPES = {
  VISIT: "visit",
  VACCINATION: "vaccination",
  ANALYSIS: "analysis_test",
  BLOOD_DONATION: "blood_donation",
};

const EVENT_TYPE_LABELS = {
  [EVENT_TYPES.VISIT]: "Doctor Visits",
  [EVENT_TYPES.VACCINATION]: "Vaccination",
  [EVENT_TYPES.ANALYSIS]: "Analysis & Tests",
  [EVENT_TYPES.BLOOD_DONATION]: "Blood donation",
};

export default function EventsPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["events"],
    queryFn: fetchRecords,
    retry: (failureCount, error) => {
      if (error.response?.status === 401) return false;
      return failureCount < 3;
    },
  });

  const [activeFilter, setActiveFilter] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    finishDate: "",
    startTime: "",
    eventType: EVENT_TYPES.VISIT,
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (error?.response?.status === 401) {
      Swal.fire({
        icon: "error",
        title: "Session Expired",
        text: "Please login again",
      }).then(() => {
        window.location.href = "/login";
      });
    }
  }, [error]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEvent = {
      name: formData.name,
      description: formData.description,
      start_date: formData.startDate,
      finish_date: formData.finishDate,
      start_time: formData.startTime,
      event_type: formData.eventType,
      medical_specialty: formData.id || null,
      completed: false,
    };

    try {
      await addRecord(newEvent);

      Swal.fire({
        icon: "success",
        title: "Event saved successfully!",
        showConfirmButton: false,
        timer: 2000,
      });

      setFormData({
        name: "",
        description: "",
        startDate: "",
        finishDate: "",
        startTime: "",
        eventType: EVENT_TYPES.VISIT,
      });
      setShowModal(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to save event!",
      });
    }
  };

  const normalizedEvents = (data || []).map((event) => ({
    ...event,
    event_type: event.event_type.replace(" ", "_"),
  }));

  const filteredEvents = normalizedEvents.filter((event) => {
    if (activeFilter === "all") return true;
    return event.event_type === activeFilter;
  });

  const sortedEvents = filteredEvents.slice().sort((a, b) => {
    const dateA = new Date(`${a.start_date}T${a.start_time || "00:00"}`);
    const dateB = new Date(`${b.start_date}T${b.start_time || "00:00"}`);
    return dateA - dateB; // зростання
  });

  const handleDelete = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Delete Event",
      text: "Are you sure you want to delete this event?",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteRecord(id);
          Swal.fire({
            icon: "success",
            title: "Event deleted successfully!",
            showConfirmButton: false,
            timer: 1000,
          });
          await refetch();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message || "Failed to delete event!",
          });
        }
      }
    });
  };

  return (
    <>
      <NavBar />
      <div className="events-page">
        <h2>My Events</h2>

        {/* Filter controls */}
        <div className="filter-controls">
          <button
            className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All Events
          </button>

          {Object.entries(EVENT_TYPE_LABELS).map(([type, label]) => (
            <button
              key={type}
              className={`filter-btn ${activeFilter === type ? "active" : ""}`}
              onClick={() => setActiveFilter(type)}
            >
              {label}
            </button>
          ))}
        </div>

        <button className="btn-open-modal" onClick={() => setShowModal(true)}>
          Add Event
        </button>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Add New Event</h3>
              <form onSubmit={handleSubmit}>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  className="event-type-select"
                  required
                >
                  <option value="" disabled>
                    Choose some types of events
                  </option>

                  {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
                    <option
                      key={value}
                      value={value === EVENT_TYPES.DEFAULT ? "" : value}
                      disabled={value === EVENT_TYPES.DEFAULT}
                    >
                      {label}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                />
                <div className="modal-buttons">
                  <button type="submit" className="btn-save">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Events display */}
        {isLoading ? (
          <p>Loading events...</p>
        ) : isError ? (
          <p>Error: {error.message}</p>
        ) : filteredEvents.length === 0 ? (
          <p>No events found for this filter.</p>
        ) : (
          <ul className="event-list">
            {sortedEvents.map((event) => (
              <li key={event.id} className="event-item">
                <div className="event-header">
                  <h3 className="event-title">{event.name || "Untitled"}</h3>
                  <span className="event-date-time">
                    {event.start_date || "no date specified"}
                    {event.start_time && `, ${event.start_time.slice(0, 5)}`}
                  </span>
                </div>
                <div className="event-type-badge">
                  {EVENT_TYPE_LABELS[event.event_type] || "Other"}
                </div>
                {event.medical_specialty && (
                  <div className="event-specialty">
                    <span>Specialty: </span>
                    <strong>
                      {event.medical_specialty.title || event.name}
                    </strong>
                  </div>
                )}
                {event.short_description && (
                  <p className="event-description">{event.short_description}</p>
                )}
                <button
                  className="btn-delete-event"
                  onClick={() => handleDelete(event.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </>
  );
}
