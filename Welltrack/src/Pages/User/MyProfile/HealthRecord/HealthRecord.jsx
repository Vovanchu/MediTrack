import React, { useState, useEffect } from "react";
import {
  FileText,
  Calendar,
  Activity,
  Pill,
  Syringe,
  Heart,
  Plus,
} from "lucide-react";
import "./HealthRecord.scss";
import NavBar from "../../components/NavBar/NavBar";
import BtnBack from "../../components/ui/BtnBack/BtnBack";
import { fetchRecords, addRecord } from "../../../../API/accounts";

const recordTypes = [
  { value: "all", label: "All Records" },
  { value: "visit", label: "Doctor Visit" },
  { value: "test", label: "Test / Lab" },
  { value: "vaccination", label: "Vaccination" },
  { value: "medication", label: "Medication" },
  { value: "symptom", label: "Symptom" },
  { value: "vital", label: "Vital Sign" },
];

const iconsMap = {
  visit: <Heart className="icon-blue" />,
  test: <FileText className="icon-purple" />,
  vaccination: <Syringe className="icon-green" />,
  medication: <Pill className="icon-orange" />,
  symptom: <Activity className="icon-red" />,
  vital: <Activity className="icon-teal" />,
  all: <FileText className="icon-gray" />,
};

const colorsMap = {
  visit: "badge-blue",
  test: "badge-purple",
  vaccination: "badge-green",
  medication: "badge-orange",
  symptom: "badge-red",
  vital: "badge-teal",
};

export default function HealthRecord() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [newRecord, setNewRecord] = useState({
    type: "visit",
    title: "",
    description: "",
    provider: "",
    value: "",
    unit: "",
    date: "",
  });

  // Завантажуємо всі записи
  useEffect(() => {
    async function loadRecords() {
      try {
        const { data } = await fetchRecords();
        setRecords(data);
      } catch (error) {
        console.error("Failed to fetch records:", error);
        alert("Error loading health records");
      } finally {
        setLoading(false);
      }
    }
    loadRecords();
  }, []);

  const filterRecordsByType = (type) => {
    if (type === "all") return records;
    return records.filter((record) => record.type === type);
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      const { data: savedRecord } = await addRecord(newRecord);
      setRecords((prev) => [...prev, savedRecord]);
      setNewRecord({
        type: "visit",
        title: "",
        description: "",
        provider: "",
        value: "",
        unit: "",
        date: "",
      });
      setShowForm(false);
    } catch {
      alert("Error saving record");
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="health-page">
          <p>Loading health records...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="health-page">
        <header className="health-header">
          <div className="header-content">
            <div>
              <h1 className="title">Health Record</h1>
              <p className="subtitle">
                Your complete medical history and health timeline
              </p>
            </div>
            <div className="actions">
              <BtnBack />
              <button className="btn-add" onClick={() => setShowForm(true)}>
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

        {/* Модальне вікно додавання */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Add New Record</h2>
              <form onSubmit={handleAddRecord}>
                <label>
                  Type:
                  <select
                    name="type"
                    id="type"
                    value={newRecord.type}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, type: e.target.value })
                    }
                    required
                  >
                    {recordTypes
                      .filter((r) => r.value !== "all")
                      .map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                  </select>
                </label>
                <label>
                  Title:
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={newRecord.title}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, title: e.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  Description:
                  <textarea
                    name="description"
                    id="description"
                    value={newRecord.description}
                    onChange={(e) =>
                      setNewRecord({
                        ...newRecord,
                        description: e.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  Provider:
                  <input
                    type="text"
                    name="provider"
                    id="provider"
                    value={newRecord.provider}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, provider: e.target.value })
                    }
                  />
                </label>
                <label>
                  Value:
                  <input
                    type="text"
                    name="value"
                    id="value"
                    value={newRecord.value}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, value: e.target.value })
                    }
                  />
                </label>
                <label>
                  Unit:
                  <input
                    type="text"
                    name="unit"
                    id="unit"
                    value={newRecord.unit}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, unit: e.target.value })
                    }
                  />
                </label>
                <label>
                  Date:
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={newRecord.date}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, date: e.target.value })
                    }
                    required
                  />
                </label>
                <div className="form-actions">
                  <button type="submit" className="btn-submit">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Список записів */}
        <section className="records-list">
          {filterRecordsByType(activeTab).length === 0 ? (
            <div className="no-records">
              <FileText className="no-records-icon" />
              <h2>No records found</h2>
              <p>Records will appear here as you add health information</p>
            </div>
          ) : (
            filterRecordsByType(activeTab)
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((record) => (
                <article key={record.id} className="record-card">
                  <div className="record-header">
                    <div className={`icon-wrapper ${colorsMap[record.type]}`}>
                      {iconsMap[record.type]}
                    </div>
                    <div>
                      <h3 className="record-title">{record.title}</h3>
                      <div className="record-meta">
                        <span className={`badge ${colorsMap[record.type]}`}>
                          {record.type}
                        </span>
                        <time className="record-date">
                          <Calendar className="calendar-icon" />{" "}
                          {new Date(record.date).toLocaleDateString()}
                        </time>
                      </div>
                    </div>
                  </div>
                  <p className="record-desc">{record.description}</p>
                  {record.provider && (
                    <p className="record-provider">
                      <strong>Provider:</strong> {record.provider}
                    </p>
                  )}
                  {record.value && record.unit && (
                    <p className="record-value">
                      <strong>Value:</strong> {record.value} {record.unit}
                    </p>
                  )}
                </article>
              ))
          )}
        </section>
      </div>
    </>
  );
}
