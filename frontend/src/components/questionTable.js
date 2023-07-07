import React, { useEffect, useState } from "react";
import fetch from "cross-fetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const QuestionTable = () => {
  const [questions, setQuestions] = useState([]);

  const getQuestions = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/question", {
        method: "GET",
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Unable to fetch questions: ${errorMessage}`);
      }
      const data = await response.json();
      let new_data = [];
      if (data) {
        new_data = JSON.parse(data);
      }
      setQuestions(new_data);;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleDelete = async (question_to_delete) => {
    const response = await fetch(
      `http://localhost:3000/api/question?&question=${question_to_delete}`,
      {
        method: "DELETE",
      }
    );
    if (response.ok) {
      console.log("Answer deleted successfully");
      getQuestions();
    } else {
      console.log("Answer deletion failed");
    }
  };

  useEffect(() => {
    getQuestions();
  }, []);

  // no css here
  //   return (
  //     <div className="questionTable">
  //       <table className="questionTable">
  //         <thead>
  //           <tr>
  //             <th>Question</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {questions.map((question) => {
  //             return (
  //               <tr key={question}>
  //                 <td>{question}</td>
  //                 <td>
  //                   <button onClick={() => handleDelete(question)}>Delete</button>
  //                 </td>
  //               </tr>
  //             );
  //           })}
  //         </tbody>
  //       </table>
  //     </div>
  //   );
  return (
    <div
      style={{
        display: "flex",
        marginTop: "2rem",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#222",
      }}
    >
      <div
        style={{
          backgroundColor: "#333",
          padding: "1rem",
          borderRadius: "5px",
          width: "80%",
        }}
      >
        <table
          style={{
            borderCollapse: "collapse",
            color: "#fff",
            width: "100%",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  borderBottom: "2px solid #fff",
                  paddingBottom: "0.5rem",
                  color: "white",
                  fontSize: "1.3rem",
                }}
              >
                Question
              </th>
              <th
                style={{
                  borderBottom: "2px solid #fff",
                  paddingBottom: "0.5rem",
                  color: "white",
                  fontSize: "1.3rem",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question, index) => {
              return (
                <tr key={index}>
                  <td
                    style={{
                      paddingTop: "0.5rem",
                    }}
                  >
                    {question}
                  </td>
                  <td
                    style={{
                      paddingTop: "0.5rem",
                    }}
                  >
                    <button
                      onClick={() => handleDelete(question)}
                      style={{
                        backgroundColor: "#ff6347",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        padding: "0.5rem",
                        cursor: "pointer",
                      }}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionTable;
