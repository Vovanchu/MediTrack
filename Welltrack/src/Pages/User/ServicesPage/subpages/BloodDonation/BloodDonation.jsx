import React, { useState, useEffect } from "react";
import NavBar from "../../../components/NavBar/NavBar";
import Footer from "../../../components/Footer/Footer";
import "./BloodDonation.scss";
import {
  Droplets,
  Plus,
  AlertTriangle,
  Heart,
  CheckCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import {
  addRecord,
  fetchBloodCenters,
  addBloodService,
} from "../../../../../API/accounts";

export default function BloodDonation() {
  const [showDialogIndex, setShowDialogIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [centres, setCentres] = useState([]);
  const [formData, setFormData] = useState({ center: "", date: "", time: "" });
  const [errors, setErrors] = useState({});

  const showAdviceModal = () => setIsModalOpen(true);

  useEffect(() => {
    fetchBloodCenters()
      .then((data) => {
        console.log("Fetched centres:", data);
        setCentres(data);
      })
      .catch((err) => console.error("Error fetching centres:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setErrors({});
    setFormData({ center: "", date: "", time: "", notes: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Перевірки
    if (!formData.date || !formData.time) {
      Swal.fire({
        icon: "warning",
        title: "Помилка",
        text: "Будь ласка, заповніть дату та час.",
      });
      return;
    }

    if (!formData.center) {
      Swal.fire({
        icon: "warning",
        title: "Помилка",
        text: "Будь ласка, виберіть центр здачі крові.",
      });
      return;
    }

    const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
    const now = new Date();
    if (selectedDateTime < now) {
      Swal.fire({
        icon: "warning",
        title: "Помилка",
        text: "Не можна записатися на минулий час.",
      });
      return;
    }

    const [hours, minutes] = formData.time.split(":").map(Number);
    if (hours < 8 || hours > 18 || (hours === 18 && minutes > 0)) {
      Swal.fire({
        icon: "warning",
        title: "Помилка",
        text: "Можна записатися тільки між 08:00 та 18:00.",
      });
      return;
    }

    try {
      const bloodDonationPayload = {
        user: 5,
        center: formData.center,
        date: formData.date,
        time: formData.time,
      };

      const bloodDonation = await addBloodService(bloodDonationPayload);

      console.log("Створений запис BloodDonation:", bloodDonation);

      const eventPayload = {
        start_date: formData.date,
        start_time: formData.time,
        blood_donation: bloodDonation.id,
        short_description: `You have registered to donate blood at ${
          centres.find((c) => c.id === formData.center)?.title
        }`,
        event_type: "blood_donation",
      };

      console.log("Дані, які підуть у Event:", eventPayload);

      await addRecord(eventPayload);

      Swal.fire({
        icon: "success",
        title: "Успіх!",
        text: "Запис успішно додано.",
      });

      setFormData({ date: "", time: "", center: "", notes: "" });
      setErrors({});
      closeModal();
    } catch (error) {
      if (error.response?.data) {
        setErrors(error.response.data);
      }
      Swal.fire({
        icon: "error",
        title: "Помилка",
        text: "Не вдалося додати запис.",
      });
      console.error("Error creating blood donation or event:", error);
    }
  };

  const infoSections = [
    {
      title: "Risks",
      colorClass: "risks",
      Icon: AlertTriangle,
      contentParagraphs: [
        "Blood donation is generally safe, but there are some minor risks to be aware of:",
      ],
      contentList: [
        "Temporary dizziness or lightheadedness",
        "Minor bruising at the needle site",
        "Rare allergic reactions to antiseptics",
        "Very rare risk of nerve damage or infection",
      ],
      emphasisText:
        "These risks are minimal and serious complications are extremely rare when proper procedures are followed.",
    },
    {
      title: "How to prepare",
      colorClass: "prepare",
      Icon: Heart,
      contentParagraphs: [
        "Follow these steps to prepare for your blood donation:",
      ],
      contentList: [
        "Get a good night's sleep (7-8 hours)",
        "Eat a healthy meal 2-3 hours before donating",
        "Drink plenty of water throughout the day",
        "Avoid alcohol for 24 hours before donation",
        "Bring a valid ID and list of medications",
        "Wear comfortable clothing with sleeves that roll up easily",
      ],
      emphasisText:
        "Being well-prepared helps ensure a smooth donation experience.",
    },
    {
      title: "What you can expect",
      colorClass: "expect",
      Icon: CheckCircle,
      contentParagraphs: [
        "Here's what happens during your blood donation visit:",
      ],
      contentList: [
        "Registration (10 min): Check-in and review donation history",
        "Health screening (15 min): Mini-physical and health questionnaire",
        "Donation (8-10 min): The actual blood collection process",
        "Recovery (10-15 min): Rest and enjoy refreshments",
      ],
      emphasisText:
        "Total time is usually 45-60 minutes. You'll donate about 1 pint of blood.",
    },
  ];

  return (
    <div className="blood-donation-page">
      <NavBar />
      <main>
        <section className="hero">
          <div className="hero-icon">
            <Droplets className="droplets-icon" />
          </div>
          <h1>Blood Donation</h1>
          <p>
            Save lives by donating blood. Learn about the process and schedule
            your next donation.
          </p>
        </section>

        <section className="highlight">
          <h2>Every Donation Saves Lives</h2>
          <p>
            One blood donation can help save up to three lives. Your
            contribution makes a real difference in your community.
          </p>
          <button onClick={showAdviceModal} className="btn btn--primary">
            <Plus className="plus-icon" />
            Schedule Donation
          </button>
        </section>

        {isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modalTitle"
            >
              <h2 id="modalTitle">Schedule Blood Donation</h2>
              <p>Add a blood donation appointment to your calendar</p>
              <form
                onSubmit={handleSubmit}
                className="schedule-form"
                noValidate
              >
                <label>
                  Donation Center
                  <select
                    name="center"
                    value={formData.center}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a center</option>
                    {centres.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.city})
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Date:
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    aria-invalid={!!errors.date}
                    aria-describedby="date-error"
                    required
                    className={errors.date ? "error" : ""}
                  />
                  {errors.date && (
                    <small id="date-error" className="error-msg">
                      {errors.date}
                    </small>
                  )}
                </label>

                <label>
                  Time:
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    aria-invalid={!!errors.time}
                    aria-describedby="time-error"
                    required
                    className={errors.time ? "error" : ""}
                  />
                  {errors.time && (
                    <small id="time-error" className="error-msg">
                      {errors.time}
                    </small>
                  )}
                </label>

                <button type="submit" className="submit-btn btn btn--primary">
                  <Plus className="btn-icon" />
                  Add to My Events
                </button>
                <button
                  type="button"
                  className="close-btn btn btn--outline"
                  onClick={closeModal}
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        )}

        <section className="info-sections">
          {infoSections.map((section, index) => {
            const Icon = section.Icon;
            return (
              <div
                key={index}
                className={`info-card ${section.colorClass}`}
                onClick={() => setShowDialogIndex(index)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    setShowDialogIndex(index);
                }}
              >
                <div className="icon-wrapper">
                  <Icon />
                </div>
                <h3>{section.title}</h3>
              </div>
            );
          })}
        </section>

        {showDialogIndex !== null &&
          (() => {
            const section = infoSections[showDialogIndex];
            const ModalIcon = section.Icon;

            return (
              <div
                className="custom-modal-overlay"
                onClick={() => setShowDialogIndex(null)}
                role="dialog"
                aria-modal="true"
                aria-labelledby="customModalTitle"
              >
                <div
                  className="custom-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={`modal-header ${section.colorClass}`}>
                    <div className="icon-wrapper">
                      <ModalIcon
                        size={24}
                        strokeWidth={2}
                        className={`${section.colorClass}`}
                      />
                    </div>
                    <h2
                      id="customModalTitle"
                      className={`modal-title-${section.colorClass}`}
                    >
                      {section.title}
                    </h2>
                  </div>
                  <div className="modal-content_info">
                    {section.contentParagraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                    <ul>
                      {section.contentList.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    <p className={`emphasis emphasis-${section.colorClass}`}>
                      {section.emphasisText}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDialogIndex(null)}
                    className="close-btn_info btn btn--outline"
                  >
                    Close
                  </button>
                </div>
              </div>
            );
          })()}

        <section className="quick-facts">
          <h2 className="quick-facts__title">Blood Donation Facts</h2>
          <div className="quick-facts__grid">
            <div className="quick-facts__item quick-facts__item--eligibility">
              <strong className="quick-facts__item-title">Eligibility</strong>
              <p className="quick-facts__item-description">
                Must be 17+ years old, weigh at least 110 lbs, and be in good
                health
              </p>
            </div>
            <div className="quick-facts__item quick-facts__item--impact">
              <strong className="quick-facts__item-title">Impact</strong>
              <p className="quick-facts__item-description">
                One donation can help save up to 3 lives
              </p>
            </div>
            <div className="quick-facts__item quick-facts__item--frequency">
              <strong className="quick-facts__item-title">Frequency</strong>
              <p className="quick-facts__item-description">
                Can donate whole blood every 56 days (8 weeks)
              </p>
            </div>
            <div className="quick-facts__item quick-facts__item--need">
              <strong className="quick-facts__item-title">Need</strong>
              <p className="quick-facts__item-description">
                Someone needs blood every 2 seconds in the US
              </p>
            </div>
            <div className="quick-facts__item quick-facts__item--recovery">
              <strong className="quick-facts__item-title">Recovery</strong>
              <p className="quick-facts__item-description">
                Your body replaces the donated blood within 24–48 hours
              </p>
            </div>
            <div className="quick-facts__item quick-facts__item--types">
              <strong className="quick-facts__item-title">Types</strong>
              <p className="quick-facts__item-description">
                O-negative is the universal donor type
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
