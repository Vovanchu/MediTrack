import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import BtnBack from "../../components/ui/BtnBack/BtnBack";
import NavBar from "../../components/NavBar/NavBar";
import {
  fetchMedicalDocuments,
  addMedicalDocument,
} from "../../../../API/accounts";
import "./MedicalDocuments.scss";

export default function MedicalDocuments() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
  };

  const addFiles = (files) => {
    const validFiles = files.filter((file) => {
      const isValidType = [
        "image/png",
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type);
      const isValidSize = file.size <= 8 * 1024 * 1024; // 8MB
      if (!isValidType)
        Swal.fire("Error", `Непідтримуваний формат: ${file.name}`, "error");
      if (!isValidSize)
        Swal.fire("Error", `Файл перевищує 8MB: ${file.name}`, "error");
      return isValidType && isValidSize;
    });
    setSelectedFiles((prev) => [...prev, ...validFiles]);
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

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
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
    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("title", file.name);
        formData.append("file", file);
        await addMedicalDocument(formData);
      }
      Swal.fire("Success", "Файли успішно завантажені", "success");
      setSelectedFiles([]);
      const { data } = await fetchMedicalDocuments();
      setUploadedFiles(data);
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      Swal.fire("Error", "Не вдалося завантажити файли", "error");
    } finally {
      setLoading(false);
    }
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
                <h3 className="section-medicaldocuments_uploaded-title">
                  Uploaded Documents ({uploadedFiles.length})
                </h3>

                <div className="section-medicaldocuments_uploaded-grid">
                  {uploadedFiles.map((doc) => {
                    const fileType =
                      typeof doc.file_type === "string" ? doc.file_type : "";
                    const fileSize = doc.file_size || 0;
                    const fileUrl = doc.file_url || "#";

                    return (
                      <div key={doc.id} className="file-card uploaded">
                        <div className="file-card-icon">
                          {getFileIcon(fileType)}
                        </div>
                        <div className="file-card-info">
                          <p className="file-card-name">
                            {doc.file_name || "Unnamed file"}
                          </p>
                          {fileType && fileType.includes("/") && (
                            <p className="file-card-type">
                              {fileType.split("/")[1].toUpperCase()}
                            </p>
                          )}
                          {fileSize > 0 && (
                            <p className="file-card-size">
                              {formatFileSize(fileSize)}
                            </p>
                          )}
                        </div>
                        {fileUrl !== "#" && (
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="file-card-download"
                          >
                            ⬇️
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
