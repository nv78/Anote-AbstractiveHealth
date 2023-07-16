import React from "react";
import UploadButton from "../components/uploadButton";
import RedirectButton from "../components/redirectButton";
// import "../styling/redirectButtonStyle.css"

const UploadPage = () => {
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
      </nav>
      <UploadButton className="uploadBtn" />
    </div>
  );
};

export default UploadPage;
