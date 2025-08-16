import React from "react";
import "./PrivacyPolicy.scss";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";

export default function PrivacyPolicy() {
  const date = new Date();
  // Format the date to a readable string
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <NavBar />
      <div className="privacy-policy">
        <div className="wrapper">
          <h1>Privacy Policy for Welltrack</h1>
          <p className="effective-date">Effective Date: {formattedDate}</p>

          <h2>1. Information Collection</h2>
          <p>We collect:</p>
          <ul>
            <li>
              Personal data you provide (e.g., name, contact, medical records)
            </li>
            <li>Data from device usage (e.g., IP address, app logs)</li>
          </ul>

          <h2>2. Use of Information</h2>
          <p>We use collected information to:</p>
          <ul>
            <li>Provide and improve services</li>
            <li>Communicate with you and respond to requests</li>
            <li>Analyze app usage for enhancements</li>
          </ul>

          <h2>3. Data Sharing</h2>
          <p>We do not sell your data. We share information only:</p>
          <ul>
            <li>With your explicit consent</li>
            <li>As required by law</li>
            <li>
              With service providers (subject to confidentiality agreements)
            </li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We use technical and administrative measures to protect your
            information. However, no system is completely secure.
          </p>

          <h2>5. Your Rights</h2>
          <p>
            You can review, update, or delete your data at any time by
            contacting us.
          </p>

          <h2>6. Children’s Privacy</h2>
          <p>
            Welltrack is not intended for users under 13. If you are a parent
            and believe your child has provided information, please contact us.
          </p>

          <h2>7. Changes to Policy</h2>
          <p>
            We may update this policy. We’ll notify you of significant changes.
          </p>

          <h2>8. Contact</h2>
          <p>
            For questions or concerns, contact us at:{" "}
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
