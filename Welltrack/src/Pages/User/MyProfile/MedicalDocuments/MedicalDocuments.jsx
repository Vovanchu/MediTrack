import React, { useState } from "react";
import BtnBack from "../../components/ui/BtnBack/BtnBack";
import "./MedicalDocuments.scss";
import NavBar from "../../components/NavBar/NavBar";

export default function MedicalDocuments() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
  };

  const addFiles = (files) => {
    const validFiles = files.filter(file => {
      const isValidType = ['image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type);
      const isValidSize = file.size <= 8 * 1024 * 1024; // 8MB
      return isValidType && isValidSize;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
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
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('word')) return '📝';
    return '📁';
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
              Upload your medical documents in PNG, PDF, or DOCX format (up to 8MB each)
            </p>

            <div 
              className={`section-medicaldocuments_upload-box ${isDragOver ? 'drag-over' : ''}`}
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
                Supported formats: PNG (up to 8MB), PDF (up to 8MB), DOCX (up to 8MB)
              </p>
            </div>

            {selectedFiles.length > 0 && (
              <div className="section-medicaldocuments_files">
                <h3 className="section-medicaldocuments_files-title">
                  Selected Files ({selectedFiles.length})
                </h3>
                
                <div className="section-medicaldocuments_file-grid">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="section-medicaldocuments_file-item">
                      <div className="file-info">
                        <span className="file-icon">{getFileIcon(file.type)}</span>
                        <div className="file-details">
                          <p className="file-name">{file.name}</p>
                          <p className="file-size">{formatFileSize(file.size)}</p>
                          <p className="file-type">{file.type.split('/')[1]?.toUpperCase()}</p>
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
                  <button className="btn-upload-all">
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
          </div>
        </div>
      </section>
    </>
  );
}