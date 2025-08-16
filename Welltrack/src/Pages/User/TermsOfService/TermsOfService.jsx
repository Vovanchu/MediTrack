import React from "react";
import "./TermsOfService.scss";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";

export default function TermsOfService() {
  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <NavBar />
      <div className="terms-of-service">
        <div className="wrapper">
          <h1>Terms of Service for Welltrack</h1>
          <p className="effective-date">Effective Date: {formattedDate}</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By using Welltrack (“the App”), you agree to these Terms of Service.
            If you do not agree, please discontinue use immediately.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Welltrack provides tools for users to track, store, and manage their
            personal health records, including doctor visits, vaccinations, test
            results, and other medical history.
          </p>

          <h2>3. User Obligations</h2>
          <ul>
            <li>Provide accurate, current information.</li>
            <li>Do not upload fraudulent or harmful content.</li>
            <li>
              Keep your login credentials secure. You are responsible for all
              activity under your account.
            </li>
          </ul>

          <h2>4. Restrictions</h2>
          <ul>
            <li>No unlawful, offensive, or abusive behavior.</li>
            <li>No unauthorized data collection or reverse engineering.</li>
            <li>Do not misuse health-related information.</li>
          </ul>

          <h2>5. Medical Disclaimer</h2>
          <p>
            Welltrack does not offer medical advice, diagnosis, or treatment.
            Always consult your healthcare provider for medical concerns.
          </p>

          <h2>6. Account Termination</h2>
          <p>
            We reserve the right to suspend or terminate accounts violating
            these terms.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            We make reasonable efforts for privacy and security, but are not
            liable for damages resulting from use of the app.
          </p>

          <h2>8. Modifications</h2>
          <p>
            We may update these terms. Continued use after updates constitutes
            acceptance.
          </p>

          <h2>9. Contact</h2>
          <p>
            Questions or concerns? Email us at:{" "}
            <a href="mailto:welltracksupport@gmail.com">
              welltracksupport@gmail.com
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
