import React from "react";
import RedirectButton from "../components/redirectButton";
import DisplayFile from "../components/displayFiles";
// import "../styling/Annotation.css"
// import "../styling/redirectButtonStyle.css"

const AnnotatePage = () => {
  return (
    <div className="upload">
      <h1 className="abstractivetitle">Abstractive Health</h1>
      <nav>
        <RedirectButton
          className="redirectButton"
          buttonText="Home"
          buttonUrl="/home"
        />
        <RedirectButton
          className="redirectButton"
          buttonText="Upload"
          buttonUrl="/upload"
        />
        <RedirectButton
          className="redirectButton"
          buttonText="Customize"
          buttonUrl="/customize"
        />
        <RedirectButton
          className="redirectButton"
          buttonText="Annotate"
          buttonUrl="/annotate"
        />
        <RedirectButton
          className="redirectButton"
          buttonText="Download"
          buttonUrl="/download"
        />
        <RedirectButton buttonText="Admin" buttonUrl="/admin" />
      </nav>
      <DisplayFile />
    </div>
  );
};

export default AnnotatePage;
