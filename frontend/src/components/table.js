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
      console.log("data", data)
      setJsonData(data); // JSON.parse is not needed as response.json() already parses the response.
    }
  };

  useEffect(() => {
    getEverything();
  }, []);

  const getHeader = () => {
    if (!jsonData || !jsonData.questions) return null;
  
    return (
      <tr style={styles.headerRow}>
        <th style={styles.headerCell}>File Name</th>
        <th style={styles.headerCell}>Question</th>
        <th style={styles.headerCell}>Answer</th>
        <th style={styles.headerCell}>Completed</th>
      </tr>
    );
  };
  
  const getRowsData = () => {
    if (!jsonData || !jsonData.file_names || !jsonData.finished || !jsonData.questions) return null;
  
    const rows = Object.entries(jsonData.file_names).flatMap(([file, answers], idx) => (
      answers.map((answer, i) => (
        <tr style={styles.row} key={`${file}_${i}`}>
          <td style={styles.cell}>{file}</td>
          <td style={styles.cell}>{jsonData.questions[i] ? jsonData.questions[i] : 'N/A'}</td>
          <td style={styles.cell}>{answer}</td>
          <td style={styles.cell}>{jsonData.finished.includes(file) ? "Yes" : "No"}</td>
        </tr>
      ))
    ));
  
    return rows.slice(0, 10); // limit the rows to 10
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

// import React, { useState, useEffect } from "react";

// const Table = () => {
//   const [jsonData, setJsonData] = useState(null);

//   const getEverything = async () => {
//     const response = await fetch("http://localhost:3000/api/everything", {
//       method: "GET",
//     });
//     if (!response.ok) {
//       const errorMessage = await response.text();
//       throw new Error(`Unable to fetch questions: ${errorMessage}`);
//     } else {
//       const data = await response.json();
//       setJsonData(JSON.parse(data));
//     }
//   };

//   useEffect(() => {
//     getEverything();
//   }, []);

//   const getHeader = () => {
//     if (!jsonData) return null;

//     // Assume first object keys represent all possible questions
//     const firstKey = Object.keys(jsonData)[0];
//     const questions = jsonData[firstKey].map((obj) => obj.question);

//     return (
//       <tr style={styles.headerRow}>
//         <th style={styles.headerCell}>File</th>
//         {questions.map((q, idx) => (
//           <th style={styles.headerCell} key={idx}>
//             {q}
//           </th>
//         ))}
//       </tr>
//     );
//   };

//   const getRowsData = () => {
//     if (!jsonData) return null;

//     return Object.entries(jsonData).map(([file, qas], idx) => (
//       <tr style={styles.row} key={idx}>
//         <td style={styles.cell}>{file}</td>
//         {qas.map((qa, i) => (
//           <td style={styles.cell} key={i}>
//             {qa.answer}
//           </td>
//         ))}
//       </tr>
//     ));
//   };

//   return (
//     <div style={styles.container}>
//       <table style={styles.table}>
//         <thead>{getHeader()}</thead>
//         <tbody>{getRowsData()}</tbody>
//       </table>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     height: "80vh",
//   },
//   table: {
//     width: "80%",
//     borderCollapse: "collapse",
//   },
//   headerRow: {
//     backgroundColor: "#A9A9A9",
//   },
//   headerCell: {
//     padding: "10px",
//     border: "1px solid #000",
//     fontWeight: "bold",
//     textAlign: "center",
//     color: "#ffffff",
//   },
//   row: {
//     backgroundColor: "#D3D3D3",
//   },
//   cell: {
//     padding: "10px",
//     border: "1px solid #000",
//     textAlign: "center",
//   },
// };

// export default Table;
