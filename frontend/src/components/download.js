import React, { useState, useEffect } from "react";

function Download() {
  const [jsonInput, setJsonInput] = useState("");

  useEffect(() => {
    getEverything();
  }, []);

  const jsonToCsv = (jsonObj) => {
    let rows = [];

    for (let file in jsonObj.file_names) {
      if (!jsonObj.file_names.hasOwnProperty(file)) continue;

      jsonObj.file_names[file].forEach((answer, i) => {
        let row = {};
        row['FileName'] = file;
        row['Question'] = jsonObj.questions[i] ? jsonObj.questions[i] : 'N/A';
        row['Answer'] = answer;
        row['Completed'] = jsonObj.finished.includes(file) ? "Yes" : "No";
        rows.push(row);
      });
    }

    // Convert object to CSV string
    const csv = rows.map(row => {
      return Object.values(row).map(val => JSON.stringify(val)).join(',');
    }).join('\r\n');

    // Add header
    const header = Object.keys(rows[0]).join(',') + '\r\n';
    return header + csv;
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
      setJsonInput(data);
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
      style={{ ...buttonStyle }}
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
  marginBottom: "10px",
  marginLeft: "40%",
  textAlign: "center",
  justifyContent: "left",
  textDecoration: "none",
  display: "inline-block",
  fontSize: "16px",
  cursor: "pointer",
  borderRadius: "12px",
  backgroundColor: "#28b2fb"
};
export default Download;
