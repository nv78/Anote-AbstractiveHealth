import React, { useEffect, useState } from "react";
import fetch from "cross-fetch";
import Table from "./questionTable";

const UploadQuestion = () => {
  const [question, setQuestion] = useState("");
  const [all_file_names, setAllFileNames] = useState([]);

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = async (file_name) => {
    const response = await fetch("http://localhost:3000/api/qa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question,
        answer: "",
        fileName: file_name,
      }),
    });
    if (response.ok) {
      console.log("Question uploaded successfully!");
      setQuestion("");
      window.location.reload();
    } else {
      console.log("Question upload failed");
    }
  };

  const getFileNames = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/fileNames");
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Unable to fetch file names: ${errorMessage}`);
      }
      const data = await response.json();
      setAllFileNames(data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    getFileNames();
  }, []);

  return (
    <div>
      <div className="upload" style={containerStyle}>
        <textarea
          style={{ width: "70%", marginLeft: "10vw", fontSize: "16px" }}
          type="text"
          value={question}
          onChange={handleQuestionChange}
          rows="4"
          cols="50"
        />
        <button
          style={{ ...buttonStyle, backgroundColor: "#4CAF50" }}
          onClick={() => {
            all_file_names.map((file_name) => {
              return handleSubmit(file_name);
            });
          }}
        >
          Submit
        </button>
      </div>
      <Table className="upload" />
    </div>
  );
};

// CSS styles
const buttonStyle = {
  border: "none",
  color: "white",
  padding: "10px 20px",
  textAlign: "center",
  textDecoration: "none",
  display: "inline-block",
  fontSize: "16px",
  margin: "4px 2px",
  cursor: "pointer",
  borderRadius: "12px",
  width: "100px",
  marginLeft: "5vw",
};

const containerStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center", // Optional, if you want the elements vertically aligned
};
export default UploadQuestion;
