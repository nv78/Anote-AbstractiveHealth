import React from "react";
import RedirectButton from "../components/redirectButton";
import Download from "../components/download";
import Table from "../components/table.js";
import LoginButton from "../components/loginButton";
// import "../styling/redirectButtonStyle.css"

const DownloadPage = () => {
  return (
    <div className="download">
      <h1 className="abstractivetitle">Abstractive Health</h1>
      <nav>
        <RedirectButton buttonText="Home" buttonUrl="/" />
        <RedirectButton buttonText="Upload" buttonUrl="/upload" />
        <RedirectButton buttonText="Customize" buttonUrl="/customize" />
        <RedirectButton buttonText="Annotate" buttonUrl="/annotate" />
        <RedirectButton buttonText="Download" buttonUrl="/download" />
        <RedirectButton buttonText="Admin" buttonUrl="/admin" />
        <LoginButton />
      </nav>
      <Table />
      <Download />
    </div>
  );
};

export default DownloadPage;
