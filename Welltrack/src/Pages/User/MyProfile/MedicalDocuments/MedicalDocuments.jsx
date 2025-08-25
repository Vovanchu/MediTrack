import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import BtnBack from "../../components/ui/BtnBack/BtnBack";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import {
  fetchMedicalDocuments,
  addMedicalDocument,
  deleteMedicalDocument,
} from "../../../../API/accounts";
import "./MedicalDocuments.scss";

export default function MedicalDocuments() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);

  const allowedTypes = [
    "image/png",
    "application/pdf",
    "application/x-pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-word.document.macroEnabled.12",
  ];

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const { data } = await fetchMedicalDocuments();
        setUploadedFiles(data);
      } catch (error) {
        console.error("Error fetching documents:", error);
        Swal.fire("Error", "Не вдалося завантажити документи", "error");
      }
    };
    loadDocuments();
  }, []);

  // Для input
  const handleFileChange = (e) => {
    addFiles(Array.from(e.target.files));
  };

  const addFiles = (files) => {
    const newValidFiles = [];

    files.forEach((file) => {
      // Перевірка MIME
      const isValidType = allowedTypes.includes(file.type);

      // Перевірка розміру
      const isValidSize = file.size <= 8 * 1024 * 1024; // 8MB

      // Перевірка дубліката
      const isDuplicate = selectedFiles.some((f) => f.name === file.name);

      if (!isValidType) {
        Swal.fire("Error", `Непідтримуваний формат: ${file.name}`, "error");
      } else if (!isValidSize) {
        Swal.fire("Error", `Файл перевищує 8MB: ${file.name}`, "error");
      } else if (isDuplicate) {
        Swal.fire("Warning", `Файл вже доданий: ${file.name}`, "warning");
      } else {
        newValidFiles.push(file);
      }
    });

    if (newValidFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...newValidFiles]);
    }
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  // Для drag-and-drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes("pdf")) return "📄";
    if (fileType.includes("image")) return "🖼️";
    if (fileType.includes("word")) return "📝";
    return "📁";
  };

  const uploadAllFiles = async () => {
    if (selectedFiles.length === 0) return;

    setLoading(true);
    const successFiles = [];
    const failedFiles = [];

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("title", file.name);
      formData.append("file", file);

      try {
        const response = await addMedicalDocument(formData);
        successFiles.push(file.name);
        console.log("Uploaded:", response.data);
      } catch (error) {
        console.error("Upload error for", file.name, error.message);
        failedFiles.push(file.name);
      }
    }

    let message = "";
    if (successFiles.length > 0) {
      message += `Successfully uploaded: ${successFiles.join(", ")}. `;
    }
    if (failedFiles.length > 0) {
      message += `Failed to upload: ${failedFiles.join(", ")}.`;
    }

    Swal.fire(
      "Upload Result",
      message,
      failedFiles.length > 0 ? "warning" : "success"
    );

    // Оновити стан
    setSelectedFiles([]);
    try {
      const { data } = await fetchMedicalDocuments();
      setUploadedFiles(data);
    } catch (err) {
      console.error("Error fetching updated documents:", err);
    }

    setLoading(false);
  };

  return (
    <>
      <NavBar />
      <section className="section-medicaldocuments">
        <div className="wrapper">
          <div className="section-medicaldocuments_header">
            <div className="section-medicaldocuments_header-txt">
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

            <div
              className={`section-medicaldocuments_upload-box ${
                isDragOver ? "drag-over" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
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

              <p className="section-medicaldocuments_upload-box-description">
                Supported formats: PNG, PDF, DOCX (up to 8MB)
              </p>
            </div>

            {selectedFiles.length > 0 && (
              <div className="section-medicaldocuments_files">
                <h3 className="section-medicaldocuments_files-title">
                  Selected Files ({selectedFiles.length})
                </h3>

                <div className="section-medicaldocuments_file-grid">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="section-medicaldocuments_file-item"
                    >
                      <div className="file-info">
                        <span className="file-icon">
                          {getFileIcon(file.type)}
                        </span>
                        <div className="file-details">
                          <p className="file-name">{file.name}</p>
                          <p className="file-size">
                            {formatFileSize(file.size)}
                          </p>
                          <p className="file-type">
                            {file.type.split("/")[1]?.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <button
                        className="file-remove-btn"
                        onClick={() => removeFile(index)}
                        title="Remove file"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="section-medicaldocuments_actions">
                  <button
                    className="btn-upload-all"
                    onClick={uploadAllFiles}
                    disabled={loading}
                  >
                    Upload All Files
                  </button>
                  <button
                    className="btn-clear-all"
                    onClick={() => setSelectedFiles([])}
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {uploadedFiles.length > 0 && (
              <div className="section-medicaldocuments_uploaded">
                <h3 className="uploaded-title">
                  Uploaded Documents ({uploadedFiles.length})
                </h3>
                <div className="uploaded-grid">
                  {uploadedFiles.map((doc) => (
                    <div key={doc.id} className="uploaded-card">
                      <div className="uploaded-card-icon">
                        {doc.file?.includes(".pdf")
                          ? "📄"
                          : doc.file?.includes(".docx")
                          ? "📝"
                          : "🖼️"}
                      </div>
                      <div className="uploaded-card-info">
                        <p className="uploaded-card-name">
                          {doc.title || "Unnamed file"}
                        </p>
                        {doc.uploaded_at && (
                          <p className="uploaded-card-date">
                            Uploaded:{" "}
                            {new Date(doc.uploaded_at).toLocaleDateString()}{" "}
                            {new Date(doc.uploaded_at).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                      <div className="uploaded-card-actions">
                        {doc.file && (
                          <a
                            href={doc.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="download-btn"
                            title="Download"
                          >
                            ⬇️
                          </a>
                        )}
                        <button
                          className="delete-btn"
                          onClick={async () => {
                            const confirm = await Swal.fire({
                              icon: "warning",
                              title: "Delete Document",
                              text: "Are you sure you want to delete this document?",
                              showCancelButton: true,
                              confirmButtonText: "Yes, delete",
                              cancelButtonText: "Cancel",
                            });
                            if (confirm.isConfirmed) {
                              try {
                                await deleteMedicalDocument(doc.id);
                                Swal.fire(
                                  "Deleted!",
                                  "Document has been deleted.",
                                  "success"
                                );
                                const { data } = await fetchMedicalDocuments();
                                setUploadedFiles(data);
                              } catch (error) {
                                console.error(
                                  "Error deleting document:",
                                  error
                                );
                                Swal.fire(
                                  "Error",
                                  "Не вдалося видалити документ",
                                  "error"
                                );
                              }
                            }
                          }}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
