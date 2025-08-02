import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { fetchRecords, addRecord } from "../../../API/accounts";
import "./MyEvents.scss";

export default function EventsPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["events"],
    queryFn: fetchRecords,
  });

  const events = Array.isArray(data) ? data : data ? [data] : [];

  const [formData, setFormData] = useState({
    /* ... */
  });
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEvent = {
      name: formData.name,
      description: formData.description,
      startDate: formData.startDate,
      finishDate: formData.finishDate,
      startTime: formData.startTime,
      type: "doctor",
      completed: false,
    };

    console.log("Fetched events data:", data);

    try {
      await addRecord(newEvent);
      await refetch();

      Swal.fire({
        icon: "success",
        title: "Подія успішно збережена!",
        showConfirmButton: false,
        timer: 2000,
      });

      setFormData({
        name: "",
        description: "",
        startDate: "",
        finishDate: "",
        startTime: "",
      });
      setShowModal(false);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Помилка",
        text: "Не вдалося зберегти подію!",
      });
    }
  };

  return (
    <div className="events-page">
      <h2>My Events</h2>
      <button className="btn-open-modal" onClick={() => setShowModal(true)}>
        Add Event
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Event</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="Event Name"
                onChange={handleInputChange}
              />
              <textarea
                name="description"
                value={formData.description}
                placeholder="Event Description"
                onChange={handleInputChange}
              />
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
              />
              <input
                type="date"
                name="finishDate"
                value={formData.finishDate}
                onChange={handleInputChange}
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

      {isLoading ? (
        <p>Loading events...</p>
      ) : isError ? (
        <p>Error fetching events</p>
      ) : events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul className="event-list">
          {events.map((event, index) => (
            <li key={event.id || index}>
              <strong>{event.short_description || "Без назви"}</strong> (
              {event.start_date || "дата не вказана"})
              <br />
              {event.description || ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
