import React, { useState } from "react";
import UploadButton from "../components/uploadButton";
import RedirectButton from "../components/redirectButton";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";

const UploadPage = () => {
  const navigate = useNavigate();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const csvString = reader.result;

        Papa.parse(csvString, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            console.log(results.data);
            navigate("/reviewAnnotate", { state: { info: results.data } });
          },
        });
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="upload">
      <h1 className="abstractivetitle">Abstractive Health</h1>
      <nav>
        <RedirectButton buttonText="Home" buttonUrl="/home" />
        <RedirectButton buttonText="Upload" buttonUrl="/upload" />
        <RedirectButton buttonText="Customize" buttonUrl="/customize" />
        <RedirectButton buttonText="Annotate" buttonUrl="/annotate" />
        <RedirectButton buttonText="Download" buttonUrl="/download" />
        <RedirectButton buttonText="Admin" buttonUrl="/admin" />
        <RedirectButton buttonText="Review" buttonUrl="/review" />
      </nav>
      <UploadButton className="uploadBtn" />
      <span className="text-white font-semibold">For Reviewing :</span>
      <input
        type="file"
        multiple
        accept=".csv"
        onChange={handleFileSelect}
        style={{ display: "none" }} // Hide the file input element
        id="csvUpload" // Add an ID for label 'for' attribute
      />
      <label className="ml-2" htmlFor="csvUpload" style={labelStyle}>
        Upload CSV
      </label>
    </div>
  );
};

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
  marginTop: "50px",
};

export default UploadPage;
