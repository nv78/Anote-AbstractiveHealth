import React, { useState, useEffect } from "react";

const Table = () => {
  const [jsonData, setJsonData] = useState(null);

  const getEverything = async () => {
    const response = await fetch("http://localhost:3000/api/everything", {
      method: "GET",
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Unable to fetch questions: ${errorMessage}`);
    } else {
      const data = await response.json();
      setJsonData(JSON.parse(data));
    }
  };

  useEffect(() => {
    getEverything();
  }, []);

  const getHeader = () => {
    if (!jsonData) return null;

    // Assume first object keys represent all possible questions
    const firstKey = Object.keys(jsonData)[0];
    const questions = jsonData[firstKey].map((obj) => obj.question);

    return (
      <tr style={styles.headerRow}>
        <th style={styles.headerCell}>File</th>
        {questions.map((q, idx) => (
          <th style={styles.headerCell} key={idx}>
            {q}
          </th>
        ))}
      </tr>
    );
  };

  const getRowsData = () => {
    if (!jsonData) return null;

    return Object.entries(jsonData).map(([file, qas], idx) => (
      <tr style={styles.row} key={idx}>
        <td style={styles.cell}>{file}</td>
        {qas.map((qa, i) => (
          <td style={styles.cell} key={i}>
            {qa.answer}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>{getHeader()}</thead>
        <tbody>{getRowsData()}</tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
  },
  table: {
    width: "80%",
    borderCollapse: "collapse",
  },
  headerRow: {
    backgroundColor: "#A9A9A9",
  },
  headerCell: {
    padding: "10px",
    border: "1px solid #000",
    fontWeight: "bold",
    textAlign: "center",
    color: "#ffffff",
  },
  row: {
    backgroundColor: "#D3D3D3",
  },
  cell: {
    padding: "10px",
    border: "1px solid #000",
    textAlign: "center",
  },
};

export default Table;
