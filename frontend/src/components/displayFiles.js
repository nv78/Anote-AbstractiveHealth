import React, { useEffect, useState } from "react";
import fetch from "cross-fetch";
import QuestionAndAnswer from "../components/questionAndAnswer";
import Cookies from 'js-cookie';
import "bulma/css/bulma.css";

const DisplayFile = () => {
  const [fileNames, setFileNames] = useState([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [filePreview, setFilePreview] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const session_token = Cookies.get('session_token');

  const getFileNames = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/AllowedFiles?session_token=${session_token}`);
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Unable to fetch file names: ${errorMessage}`);
      }
      const data = await response.json();
      const finishedFilesResponse = await fetch("http://localhost:3000/api/getFinished");
      const finishedFiles = await finishedFilesResponse.json();
      const sortedData = data.sort((a, b) => finishedFiles.includes(a) - finishedFiles.includes(b));
      setFileNames(sortedData);
      if (sortedData.length > 0) {
        handleFileChange(sortedData[0]);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const fetchFinishedFiles = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/getFinished");
      const finishedFiles = await response.json();
      setIsFinished(finishedFiles.includes(fileNames[selectedFileIndex]));
    } catch (error) {
      console.log("Error fetching finished files:", error);
    }
  };


  useEffect(() => {
    getFileNames();
  }, []);

  useEffect(() => {
    fetchFinishedFiles();
  }, [fileNames, selectedFileIndex]);

  const handleFileChange = async (filename) => {
    const response = await fetch(
      `http://localhost:3000/api/files?filename=${encodeURIComponent(filename)}`
    );
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

  const handlePrevious = () => {
    if (selectedFileIndex > 0) {
      setSelectedFileIndex(selectedFileIndex - 1);
      handleFileChange(fileNames[selectedFileIndex - 1]);
    }
  };

  const handleNext = () => {
    if (selectedFileIndex < fileNames.length - 1) {
      setSelectedFileIndex(selectedFileIndex + 1);
      handleFileChange(fileNames[selectedFileIndex + 1]);
    }
  };

  const handleCheckboxChange = async (event) => {
    const isChecked = event.target.checked;
    const endpoint = isChecked ? "/api/addFinished" : "/api/deleteFinished";
    const options = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: fileNames[selectedFileIndex] }),
    };

    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, options);
      if (!response.ok) {
        throw new Error(`Error updating finished state for file: ${response.statusText}`);
      }
      setIsFinished(isChecked); // Update the isFinished state
    } catch (error) {
      console.log("Error:", error);
    }
  };


  return (
    <div className="container">
      <br />
      <h2>{fileNames[selectedFileIndex]}</h2>
      {/*<label>
        <input type="checkbox" checked={isFinished} onChange={handleCheckboxChange} />
        Finished
      </label>*/}
      <button onClick={handlePrevious} disabled={selectedFileIndex === 0}>
          Previous
        </button>
        <button onClick={handleNext} disabled={selectedFileIndex === fileNames.length - 1}>
          Next
        </button>
      <br />
      <br />
      <div className="columns">
        <div className="column is-7">{filePreview}</div>
        <div className="column is-5">
          <QuestionAndAnswer filename={fileNames[selectedFileIndex]} />
        </div>
      </div>
    </div>
  );
};

export default DisplayFile;