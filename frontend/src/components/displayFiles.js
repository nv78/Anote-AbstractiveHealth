import React, { useEffect, useState } from "react";
import fetch from "cross-fetch";
import QuestionAndAnswer from "../components/questionAndAnswer";
import "bulma/css/bulma.css";

const DisplayFile = () => {
  const [fileNames, setFileNames] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const getFileNames = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/fileNames");
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Unable to fetch file names: ${errorMessage}`);
        }
        const data = await response.json();
        setFileNames(data);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    getFileNames();
  }, []);

  const handleFileChange = async (event) => {
    const filename = event.target.value;
    setSelectedFile(filename);
    const response = await fetch(
      `http://localhost:3000/api/files?filename=${encodeURIComponent(filename)}`
    );
    setFileName(encodeURIComponent(filename));
    if (!response.ok) {
      console.error(`Error fetching file ${filename}: ${response.statusText}`);
      return;
    }
    if (response.ok) {
      const file = await response.blob();
      const fileType = filename.split(".").pop();
      if (fileType === "pdf") {
        setFilePreview(
          <object
            data={URL.createObjectURL(file)}
            type="application/pdf"
            width="100%"
            height="600px"
          >
            <p>It appears you don't have a PDF plugin for this browser.</p>
          </object>
        );
      } else if (fileType === "txt") {
        const reader = new FileReader();
        reader.onload = function (event) {
          const text = event.target.result;
          setFilePreview(<pre>{text}</pre>);
        };
        reader.readAsText(file);
      }
    }
  };

  return (
    <div className="container">
      <span style={{ color: "white" }}>Select a file to view: </span>
      <select
        style={{ marginTop: "5vh" }}
        value={selectedFile}
        onChange={handleFileChange}
      >
        <option style={{ color: "white" }} value="">
          Select a file
        </option>
        {fileNames.map((fileName) => (
          <option key={fileName} value={fileName}>
            {fileName}
          </option>
        ))}
      </select>
      <br />
      <br />
      <div className="columns">
        <div className="column is-7">{filePreview}</div>
        <div className="column is-5">
          <QuestionAndAnswer filename={fileName} />
        </div>
      </div>
    </div>
  );
};

export default DisplayFile;
