import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { saveAs } from "file-saver";
import RedirectButton from "../components/redirectButton";

const ReviewPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [jsonData, setJsonData] = useState(null);

  useEffect(() => {
    const session_token = Cookies.get("session_token");
    checkAdmin(session_token);
    getEverything();
  }, []);

  const downloadData = () => {
    if (!jsonData) return;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += ["File Name", ...jsonData.questions, "Thumbs Up", "Thumbs Down"].join(",") + "\n";
    
    Object.entries(jsonData.file_names).forEach(([file, answers]) => {
      const thumbsUp = jsonData.review[file]?.thumbs_up || '0';
      const thumbsDown = jsonData.review[file]?.thumbs_down || '0';
      const row = [file, ...answers, thumbsUp, thumbsDown];
      csvContent += row.join(",") + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const file = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    saveAs(file, 'data.csv');
  };

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

  const getEverything = async () => {
    const response = await fetch("http://localhost:3000/api/everything", {
      method: "GET",
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Unable to fetch questions: ${errorMessage}`);
    } else {
      const data = await response.json();
      setJsonData(data);
    }
  };

  const getRowsData = () => {
    if (!jsonData?.file_names || !jsonData?.questions) return null;
  
    return Object.entries(jsonData.file_names).map(([file, answers], idx) => (
      <tr key={file} style={idx % 2 === 0 ? styles.rowEven : styles.rowOdd}>
        <td style={styles.cell}>{file}</td>
        {jsonData.questions.map((question, i) => (
          <td style={styles.cell} key={`cell_${i}`}>{answers[i] || 'N/A'}</td>
        ))}
        <td style={styles.cell}>{jsonData.review[file]?.thumbs_up || '0'}</td>
        <td style={styles.cell}>{jsonData.review[file]?.thumbs_down || '0'}</td>
      </tr>
    ));
  };

  return (
    <div className="upload" style={styles.container}>
      <h1 className="abstractivetitle">Abstractive Health</h1>
      <button onClick={downloadData} style={buttonStyle}>Download Data</button>
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
            <RedirectButton buttonText="Review" buttonUrl="/review" />
          </>
        )}
      </nav>
      <table style={styles.table}>
        <thead style={styles.headerRow}>
          <tr>
            <th style={styles.headerCell}>File Name</th>
            {jsonData?.questions?.map((question, i) => (
              <th style={styles.headerCell} key={`header_${i}`}>{question}</th>
            ))}
            <th style={styles.headerCell}>Thumbs Up</th>
            <th style={styles.headerCell}>Thumbs Down</th>
          </tr>
        </thead>
        <tbody>{getRowsData()}</tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
    marginLeft: "20%",
    marginTop: "5%",
  },
  table: {
    width: "80%",
    borderCollapse: "collapse",
    backgroundColor: "#333",
    color: "#fff",
  },
  headerRow: {
    backgroundColor: "#000",
  },
  headerCell: {
    padding: "10px",
    border: "1px solid #000",
    fontWeight: "bold",
    textAlign: "center",
    color: "white"
  },
  rowEven: {
    backgroundColor: "#222",
  },
  rowOdd: {
    backgroundColor: "#111",
  },
  cell: {
    padding: "10px",
    border: "1px solid #000",
    textAlign: "center",
  },
};

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

export default ReviewPage;
