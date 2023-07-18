import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import RedirectButton from "../components/redirectButton";
import DisplayFile from "../components/displayFiles";
// import "../styling/Annotation.css"
// import "../styling/redirectButtonStyle.css"

const AnnotatePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const session_token = Cookies.get("session_token");
    checkAdmin(session_token);
  }, []);

  const checkAdmin = async (session_token) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/isAdmin?session_token=${session_token}`
      );
      if (!response.ok) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="upload">
      <h1 className="abstractivetitle">Abstractive Health</h1>
      <nav>
        <RedirectButton buttonText="Home" buttonUrl="/home" />
        {isAuthenticated && (
          <>
            <RedirectButton buttonText="Upload" buttonUrl="/upload" />
            <RedirectButton buttonText="Customize" buttonUrl="/customize" />
          </>
        )}
        <RedirectButton buttonText="Annotate" buttonUrl="/annotate" />
        {isAuthenticated && (
          <>
            <RedirectButton buttonText="Download" buttonUrl="/download" />
            <RedirectButton buttonText="Admin" buttonUrl="/admin" />
          </>
        )}
      </nav>
      <DisplayFile />
    </div>
  );
};

export default AnnotatePage;
