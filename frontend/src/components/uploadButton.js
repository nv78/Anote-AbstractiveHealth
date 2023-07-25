import React, { useState } from "react";
import Cookies from 'js-cookie';

const UploadButton = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const session_token = Cookies.get('session_token');

  const handleFileChange = (event) => {
    setSelectedFiles([...event.target.files]);
  };

  const handleSubmit = async () => {
    var formData = new FormData();
    console.log("selectedFiles")
    console.log(selectedFiles)
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    // add a sleep for 2 seconds here
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("formData")
    console.log(formData)


    const response = await fetch(`http://localhost:3000/api/upload?session_token=${session_token}`, {
      method: "POST",
      body: formData,
    });
    console.log("response")
    console.log(response)
    if (response.ok) {
      console.log("Files uploaded successfully");
      setSelectedFiles([]); // Clear the selected files
      window.alert("Files uploaded successfully");
    } else {
      console.log("File upload failed");
      window.alert("File upload failed/You are not admin");
    }
  };

  const buttonColor = selectedFiles.length > 0 ? "#4CAF50" : "#808080";

  return (
    <div style={containerStyle}>
      <span style={stepStyle}>Step 1 :</span>
      <input
        type="file"
        multiple
        accept=".txt,.pdf,.csv"
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
  backgroundColor: "#3498db",
  color: "white",
  padding: "10px 20px",
  fontSize: "14px",
  fontFamily: "Helvetica Neue",
  fontWeight: "600",
  cursor: "pointer",
  borderRadius: "4px",
  transition: "background-color 0.2s ease-in-out",
};

const buttonStyle = {
  display: "inline-block",
  backgroundColor: "#808080",
  color: "white",
  padding: "10px 18px",
  border: "none",
  fontSize: "14px",
  fontFamily: "Helvetica Neue",
  fontWeight: "600",
  borderRadius: "4px",
  cursor: "pointer",
  transition: "background-color 0.2s ease-in-out",
};

const containerStyle = {
  marginTop: "10vh",
  color: "white",
};

const stepStyle = {
  marginRight: "10px",
  fontSize: "16px",
  fontFamily: "Helvetica Neue",
  fontWeight: "600"
};
export default UploadButton;
