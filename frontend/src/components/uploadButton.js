import React, { useState } from "react";

const UploadButton = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFiles([...event.target.files]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch("http://localhost:3000/api/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      console.log("Files uploaded successfully");
      setSelectedFiles([]); // Clear the selected files
      window.alert("Files uploaded successfully");
    } else {
      console.log("File upload failed");
      window.alert("File upload failed");
    }
  };

  const buttonColor = selectedFiles.length > 0 ? "#4CAF50" : "#808080";

  return (
    <div style={containerStyle}>
      <span style={stepStyle}>Step 1 :</span>
      <input
        type="file"
        multiple
        accept=".txt,.pdf"
        onChange={handleFileChange}
        style={{ display: "none" }} // Hide the file input element
        id="fileUpload" // Add an ID for label 'for' attribute
      />
      <label htmlFor="fileUpload" style={labelStyle}>
        Select Files
      </label>
      <br />
      <br />
      <span style={stepStyle}> Step 2 :</span>
      <button
        onClick={handleSubmit}
        disabled={!selectedFiles.length}
        style={{ ...buttonStyle, backgroundColor: buttonColor }}
      >
        Upload Files
      </button>
    </div>
  );
};

// CSS styles
const labelStyle = {
  display: "inline-block",
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "10px 20px",
  fontSize: "14px",
  cursor: "pointer",
  borderRadius: "4px",
};

const buttonStyle = {
  display: "inline-block",
  backgroundColor: "#808080",
  color: "white",
  padding: "10px 20px",
  border: "none",
  fontSize: "14px",
  borderRadius: "4px",
  cursor: "pointer",
};

const containerStyle = {
  marginTop: "10vh",
  color: "white",
};

const stepStyle = {
  marginRight: "10px",
  fontSize: "16px",
};
export default UploadButton;
