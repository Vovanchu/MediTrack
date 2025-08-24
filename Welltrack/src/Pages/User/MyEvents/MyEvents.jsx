import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { fetchRecords, deleteRecord } from "../../../API/accounts";
import "./MyEvents.scss";

// Function to fetch service details by ID
const fetchServiceById = async (serviceId) => {
  try {
    const response = await fetch(`/api/services/events/${serviceId}/`);
    if (!response.ok) throw new Error("Service not found");
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch service ${serviceId}:`, error);
    return null;
  }
};

import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";

const EVENT_TYPES = {
  VISIT: "visit",
  VACCINATION: "vaccination",
  ANALYSIS: "analysis",
  BLOOD_DONATION: "blood_donation",
};

const EVENT_TYPE_LABELS = {
  [EVENT_TYPES.VISIT]: "Doctor Visits",
  [EVENT_TYPES.VACCINATION]: "Vaccination",
  [EVENT_TYPES.ANALYSIS]: "Analysis & Tests",
  [EVENT_TYPES.BLOOD_DONATION]: "Blood donation",
};

// Функція для перевірки чи подія в минулому
const isPastEvent = (date, time) => {
  if (!date) return false;

  const now = new Date();
  const eventDateTime = new Date(date);

  if (time) {
    const [hours, minutes] = time.split(":");
    eventDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  } else {
    // Якщо немає часу, вважаємо що подія в кінці дня
    eventDateTime.setHours(23, 59, 59, 999);
  }

  return eventDateTime < now;
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

  const [serviceDetails, setServiceDetails] = useState({});

  useEffect(() => {
    const fetchServiceDetails = async () => {
      if (!data) return;

      const bloodDonationEvents = data.filter(
        (event) => event.event_type === EVENT_TYPES.BLOOD_DONATION
      );

      const serviceIds = [
        ...new Set(bloodDonationEvents.map((e) => e.service)),
      ];
      const newServiceDetails = {};

      for (const serviceId of serviceIds) {
        if (serviceId && !serviceDetails[serviceId]) {
          const service = await fetchServiceById(serviceId);
          if (service) newServiceDetails[serviceId] = service;
        }
      }

      if (Object.keys(newServiceDetails).length > 0) {
        setServiceDetails((prev) => ({ ...prev, ...newServiceDetails }));
      }
    };

    fetchServiceDetails();
  }, [data]);

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

  const normalizedEvents = (data || []).map((event) => {
    let displayTitle = event.name;
    let details = null;

    switch (event.event_type) {
      case EVENT_TYPES.VISIT:
        details = event.medical_specialty ?? null;
        break;
      case EVENT_TYPES.VACCINATION:
        displayTitle = event.vaccination?.title || event.name;
        details = event.vaccination ?? null;
        break;
      case EVENT_TYPES.BLOOD_DONATION:
        displayTitle = event.service?.title || event.name;
        details = event.donation_center ?? null;
        break;
      case EVENT_TYPES.ANALYSIS:
        displayTitle = event.analysis_test?.title || event.name;
        details = {
          description: event.analysis_test?.description,
          packageId: event.analysis_test?.package,
        };
        break;
      default:
        break;
    }

    // Додаємо інформацію про те, чи подія в минулому
    const isPast = isPastEvent(event.start_date, event.start_time);

    return {
      ...event,
      event_type: event.event_type?.replace(" ", "_").toLowerCase(),
      displayTitle,
      details,
      isPast,
    };
  });

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

        {/* Events display */}
        <div className="events-container">
          {isLoading ? (
            <div className="empty-state">
              <div className="empty-icon">⏳</div>
              <p>Loading events...</p>
            </div>
          ) : isError ? (
            <div className="empty-state">
              <div className="empty-icon">❌</div>
              <p className="error-message">Error: {error.message}</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <p>No events found for this filter.</p>
            </div>
          ) : (
            <ul className="events-list">
              {sortedEvents.map((event) => {
                const dateTime = `${event.start_date || "No date"}${
                  event.start_time ? `, ${event.start_time.slice(0, 5)}` : ""
                }`;

                return (
                  <li
                    key={event.id}
                    className={`event-item ${
                      event.isPast ? "event-item--past" : ""
                    }`}
                  >
                    {/* Заголовок + дата */}
                    <div className="event-header">
                      <h4 className="event-title">
                        {event.displayTitle}
                        {event.isPast && (
                          <span className="past-indicator"> ✓</span>
                        )}
                      </h4>
                      <span className="event-date">{dateTime}</span>
                    </div>

                    {/* Тип */}
                    <div
                      className={`event-badge event-badge--${
                        event.event_type
                      } ${event.isPast ? "event-badge--past" : ""}`}
                    >
                      {EVENT_TYPE_LABELS[event.event_type] || "Other"}
                    </div>

                    {/* Статус подій (тільки для минулих) */}
                    {event.isPast && (
                      <div className="event-status">
                        <span className="status-completed">Completed</span>
                      </div>
                    )}

                    {/* Деталі */}
                    <div className="event-details">
                      {event.event_type === EVENT_TYPES.VISIT &&
                        event.medical_specialty && (
                          <div>
                            <strong>Specialty:</strong>{" "}
                            {event.medical_specialty.title}
                            <p>{event.medical_specialty.description}</p>
                          </div>
                        )}

                      {event.event_type === EVENT_TYPES.VACCINATION &&
                        event.vaccination && (
                          <div>
                            <strong>Vaccine:</strong> {event.vaccination.title}
                            <p>{event.vaccination.description}</p>
                          </div>
                        )}

                      {event.event_type === EVENT_TYPES.BLOOD_DONATION &&
                        event.donation_center && (
                          <div>
                            <strong>Donation Center:</strong>{" "}
                            {event.donation_center.title},{" "}
                            {event.donation_center.city}
                            <p>{event.donation_center.address}</p>
                          </div>
                        )}

                      {event.event_type === EVENT_TYPES.ANALYSIS &&
                        event.analysis_test && (
                          <div>
                            <strong>Test:</strong> {event.analysis_test.title}
                            {event.analysis_test.package && (
                              <p>Package ID: {event.analysis_test.package}</p>
                            )}
                            <p>{event.analysis_test.description}</p>
                          </div>
                        )}
                    </div>

                    {/* Дії */}
                    <div className="event-actions">
                      <button
                        className="btn btn--danger btn--small"
                        onClick={() => handleDelete(event.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
