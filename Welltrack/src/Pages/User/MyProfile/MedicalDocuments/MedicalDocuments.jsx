import React, { useState } from "react";
import BtnBack from "../../components/ui/BtnBack/BtnBack";

import "./MedicalDocuments.scss";
import NavBar from "../../components/NavBar/NavBar";

export default function MedicalDocuments() {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  return (
    <>
      <NavBar />
      <section className="section-medicaldocuments">
        <div className="wrapper">
          <div className="section-medicaldocuments_header">
            <div className=" section-medicaldocuments_header-txt">
              <h2 className="section-medicaldocuments_header-title">
                Medical Documents
              </h2>
              <p className="section-medicaldocuments_header-subtitle">
                Upload and manage your medical documents securely
              </p>
            </div>
            <BtnBack />
          </div>

          <div className="section-medicaldocuments_upload">
            <h2 className="section-medicaldocuments_upload-title">
              Upload Documents
            </h2>
            <p className="section-medicaldocuments_upload-subtitle">
              Upload your medical documents in PNG, PDF, or DOCX format (up to
              8MB each)
            </p>

            <div className="section-medicaldocuments_upload-box">
              <h3 className="section-medicaldocuments_upload-box-title">
                Upload Medical Documents
              </h3>
              <p className="section-medicaldocuments_upload-box-subtitle">
                Drag and drop files here, or click to browse
              </p>

              <div className="section-medicaldocuments_upload-box-input">
                <input
                  type="file"
                  id="medical-upload"
                  accept=".png,.pdf,.docx"
                  multiple
                  onChange={handleFileChange}
                />
                <label htmlFor="medical-upload">Choose Files</label>
              </div>

              {selectedFiles.length > 0 && (
                <ul className="section-medicaldocuments_file-list">
                  {selectedFiles.map((file, index) => (
                    <li key={index}>
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </li>
                  ))}
                </ul>
              )}

              <p className="section-medicaldocuments_upload-box-description">
                Supported formats: PNG (up to 8MB), PDF (up to 8MB), DOCX (up to
                8MB)
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
