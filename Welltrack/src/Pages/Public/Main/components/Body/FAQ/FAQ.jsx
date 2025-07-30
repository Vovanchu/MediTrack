import React, { useState } from "react";
import "./FAQ.scss";

const faqData = [
  {
    question: "Is it safe to share my data with Welltrack?",
    answer:
      "Yes, Welltrack is HIPAA-compliant and uses top-notch security measures, encrypting your sensitive data at all times.",
  },
  {
    question: "Can I create a family account?",
    answer: "No, Welltrack offers personal accounts only as of now.",
  },
  {
    question: "Can I share my records with doctors?",
    answer:
      "Yes, you can choose to share your records with healthcare professionals.",
  },
  {
    question: "Why is Welltrack free?",
    answer:
      "Welltrack is just rolling out, so everyone is welcome to join and share their feedback with us, so we can make the app better.",
  },
  {
    question: "Do you keep my data after deleting an account?",
    answer:
      "If you delete your account, we will delete data as soon as possible, according to GDPR, as it won’t be necessary for the purposes it was collected.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq" itemScope itemType="https://schema.org/FAQPage">
      {faqData.map((item, index) => (
        <div
          className={`faq_item ${openIndex === index ? "open" : ""}`}
          key={index}
          itemScope
          itemProp="mainEntity"
          itemType="https://schema.org/Question"
        >
          <button
            className="faq_question"
            onClick={() => toggle(index)}
            aria-expanded={openIndex === index}
            aria-controls={`faq${index}`}
          >
            <span itemProp="name">{item.question}</span>
            <span className="faq_icon">{openIndex === index ? "–" : "+"}</span>
          </button>
          <div
            id={`faq${index}`}
            className="faq_answer"
            itemScope
            itemProp="acceptedAnswer"
            itemType="https://schema.org/Answer"
          >
            <div itemProp="text">{item.answer}</div>
          </div>
        </div>
      ))}
    </section>
  );
}
