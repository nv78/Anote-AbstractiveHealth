import React, { useState, useEffect } from "react";

function Download() {
  const [jsonInput, setJsonInput] = useState("");

  useEffect(() => {
    getEverything();
  }, []);

  const jsonToCsv = (jsonObj) => {
    jsonObj = JSON.parse(JSON.parse(jsonObj));
    let str = "";
    let columnNames = [];

    for (let file in jsonObj) {
      if (!jsonObj.hasOwnProperty(file)) continue;

      // Create header row if it doesn't exist
      if (!str) {
        columnNames = jsonObj[file].map(({ question }) => question);
        str = `"FileName",${columnNames
          .map((name) => `"${name}"`)
          .join(",")}\r\n`;
      }

      const answers = columnNames.map((name) => {
        const answerObj = jsonObj[file].find((obj) => obj.question === name);
        return answerObj ? `"${answerObj.answer}"` : '""';
      });

      str += `"${file}",${answers.join(",")}\r\n`;
    }

    return str;
  };

  const getEverything = async () => {
    const response = await fetch("http://localhost:3000/api/everything", {
      method: "GET",
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Unable to fetch questions: ${errorMessage}`);
    } else {
      const data = await response.json();
      setJsonInput(JSON.stringify(data));
    }
  };

  const handleDownload = () => {
    const csv = jsonToCsv(jsonInput);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "export.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <button
      style={{ ...buttonStyle, backgroundColor: "#4CAF50" }}
      onClick={handleDownload}
    >
      Download CSV
    </button>
  );
}

const buttonStyle = {
  border: "none",
  color: "white",
  padding: "10px 20px",
  textAlign: "center",
  textDecoration: "none",
  display: "inline-block",
  fontSize: "16px",
  cursor: "pointer",
  borderRadius: "12px",
};
export default Download;
