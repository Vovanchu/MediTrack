import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Calendar,
  Heart,
  Syringe,
  Activity,
  Pill,
  Plus,
} from "lucide-react";
import "./HealthRecord.scss";

import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import BtnBack from "../../components/ui/BtnBack/BtnBack";

import { fetchRecords } from "../../../../API/accounts"; // API-запити

const recordTypes = [
  { value: "all", label: "All Records" },
  { value: "visit", label: "Doctor Visit" },
  { value: "vaccination", label: "Vaccination" },
  { value: "analysis", label: "Analysis & Tests" },
  { value: "blood_donation", label: "Blood Donation" },
  { value: "medication", label: "Taking Medications" },
];

const iconsMap = {
  visit: <Heart className="icon-blue" />,
  vaccination: <Syringe className="icon-green" />,
  analysis: <Activity className="icon-purple" />,
  blood_donation: <Activity className="icon-red" />,
  medication: <Pill className="icon-orange" />,
  all: <FileText className="icon-gray" />,
};

const colorsMap = {
  visit: "badge-blue",
  vaccination: "badge-green",
  analysis: "badge-purple",
  blood_donation: "badge-red",
  medication: "badge-orange",
};

export default function HealthRecord() {
  const [activeTab, setActiveTab] = useState("all");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["healthRecords"],
    queryFn: fetchRecords,
    retry: 2,
  });

  const mapOtherType = (record) => {
    let type = record.event_type?.toLowerCase().replace(/\s+/g, "_");

    // Якщо це не "other", одразу нормалізуємо
    if (type && type !== "other") {
      if (type === "blood") return "blood_donation";
      return type;
    }

    // Для "other" пробуємо визначити по назві
    const name = record.name?.toLowerCase() || "";
    if (name.includes("analysis") || name.includes("test")) return "analysis";
    if (name.includes("blood")) return "blood_donation";
    if (name.includes("medication")) return "medication";

    return "other"; // fallback
  };

  const filterRecordsByType = (type) => {
    if (!data) return [];
    if (type === "all") return data;
    return data.filter((record) => mapOtherType(record) === type);
  };

  const renderRecordDetails = (record) => {
    const type = mapOtherType(record);

    switch (type) {
      case "visit":
        return (
          <p className="record-provider">
            <strong>Specialty:</strong> {record.medical_specialty || "—"}
          </p>
        );

      case "vaccination":
        return (
          <p className="record-provider">
            <strong>Vaccine:</strong> {record.vaccination_name || "—"}
          </p>
        );

      case "analysis":
        return (
          <p className="record-provider">
            <strong>Test/Analysis:</strong> {record.analysis_test_name || "—"}
          </p>
        );

      case "blood_donation":
        return (
          <p className="record-provider">
            <strong>Blood Donation:</strong> {record.center_name || "—"}
          </p>
        );

      case "medication":
        return (
          <p className="record-provider">
            <strong>Medication:</strong> {record.medication_name || "—"}
          </p>
        );

      default:
        return (
          <p className="record-provider">
            <strong>Note:</strong> {record.short_description || "—"}
          </p>
        );
    }
  };

  return (
    <>
      <NavBar />
      <div className="health-page">
        <header className="health-header">
          <div className="header-content">
            <div>
              <h1 className="title">Health Records</h1>
              <p className="subtitle">
                Your complete medical history and health timeline
              </p>
            </div>
            <div className="actions">
              <BtnBack />
              <button className="btn-add">
                <Plus /> Add Record
              </button>
            </div>
          </div>
        </header>

        {/* Фільтри */}
        <div className="record-filters">
          {recordTypes.map(({ value, label }) => (
            <button
              key={value}
              className={activeTab === value ? "active" : ""}
              onClick={() => setActiveTab(value)}
              type="button"
            >
              {iconsMap[value] && (
                <span className="filter-icon">{iconsMap[value]}</span>
              )}
              {label}
            </button>
          ))}
        </div>

        {/* Список записів */}
        {isLoading ? (
          <p>Loading health records...</p>
        ) : isError ? (
          <p>Error: {error.message}</p>
        ) : (
          <section className="records-list">
            {filterRecordsByType(activeTab).length === 0 ? (
              <div className="no-records">
                <FileText className="no-records-icon" />
                <h2>No records found</h2>
                <p>Records will appear here as you add health information</p>
              </div>
            ) : (
              filterRecordsByType(activeTab)
                .sort(
                  (a, b) =>
                    new Date(b.start_date + "T" + b.start_time) -
                    new Date(a.start_date + "T" + a.start_time)
                )
                .map((record) => (
                  <article key={record.id} className="record-card">
                    <div className="record-header">
                      <div
                        className={`icon-wrapper ${
                          colorsMap[mapOtherType(record)]
                        }`}
                      >
                        {iconsMap[mapOtherType(record)]}
                      </div>
                      <div>
                        <h3 className="record-title">{record.name}</h3>
                        <div className="record-meta">
                          <span
                            className={`badge ${
                              colorsMap[mapOtherType(record)]
                            }`}
                          >
                            {mapOtherType(record)}
                          </span>
                          <time className="record-date">
                            <Calendar className="calendar-icon" />{" "}
                            {new Date(
                              record.start_date + "T" + record.start_time
                            ).toLocaleString()}
                          </time>
                        </div>
                      </div>
                    </div>

                    {/* Додаємо універсальні деталі */}
                    {renderRecordDetails(record)}
                  </article>
                ))
            )}
          </section>
        )}
      </div>
      <Footer />
    </>
  );
}
