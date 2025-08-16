import React, { useState } from "react";
import "./ComplianceStatements.scss";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";

const ComplianceStatements = () => {
  const [activeTab, setActiveTab] = useState("hipaa");

  return (
    <>
      <NavBar />
      <section className="compliance">
        <h2>Compliance Statements</h2>
        <div className="tabs">
          <button
            className={activeTab === "hipaa" ? "active" : ""}
            onClick={() => setActiveTab("hipaa")}
          >
            HIPAA (US)
          </button>
          <button
            className={activeTab === "gdpr" ? "active" : ""}
            onClick={() => setActiveTab("gdpr")}
          >
            GDPR (EU/EEA)
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "hipaa" && (
            <div className="statement">
              <h3>HIPAA Compliance Statement (for US users)</h3>
              <p>
                Welltrack is committed to maintaining the privacy and security
                of your health information in accordance with the Health
                Insurance Portability and Accountability Act (HIPAA). We
                implement administrative, physical, and technical safeguards to
                ensure all Protected Health Information (PHI) is:
              </p>
              <ul>
                <li>
                  Collected, stored, and transmitted securely using encryption.
                </li>
                <li>
                  Accessed only by authorized personnel following role-based
                  permissions.
                </li>
                <li>
                  Protected through regular risk assessments, staff training,
                  and incident response protocols.
                </li>
              </ul>
              <p>
                Welltrack does not use or disclose personal health information
                except as permitted or required by law, and only for the purpose
                of providing and supporting our healthcare services. We partner
                only with HIPAA-compliant vendors and have necessary Business
                Associate Agreements (BAAs) in place.
              </p>
              <p>
                Please note: HIPAA compliance is a shared responsibility.
                Covered entities and business associates using Welltrack should
                ensure their own HIPAA obligations are met, including proper
                configuration and usage of the platform.
              </p>
            </div>
          )}

          {activeTab === "gdpr" && (
            <div className="statement">
              <h3>GDPR Compliance Statement (for EU/EEA users)</h3>
              <p>
                Welltrack is fully committed to ensuring your data privacy
                rights under the General Data Protection Regulation (GDPR). We
                guarantee that:
              </p>
              <ul>
                <li>
                  Personal and health data are collected only for explicit,
                  legitimate purposes and on a clear legal basis (such as your
                  consent).
                </li>
                <li>
                  Data minimization principles are strictly followed: only
                  essential data is collected and processed.
                </li>
                <li>
                  You retain full rights to access, correct, restrict, transfer,
                  or delete your data at any time.
                </li>
                <li>
                  Data is encrypted both in transit and at rest; access is
                  strictly controlled.
                </li>
                <li>
                  All processors and vendors handling data on our behalf comply
                  with GDPR requirements and contractual obligations.
                </li>
                <li>
                  Privacy by design and default is integrated into all product
                  development and business practices.
                </li>
                <li>
                  In the event of a data breach, Welltrack will notify affected
                  users and authorities within 72 hours as required by law.
                </li>
              </ul>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ComplianceStatements;
