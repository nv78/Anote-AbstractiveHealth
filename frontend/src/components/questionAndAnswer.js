import React, { useEffect, useState } from "react";
import fetch from "cross-fetch";
import "bulma/css/bulma.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Table from "./questionTable";

const QuestionAndAnswer = (props) => {
  const [questions_and_answers, setquestions_and_answers] = useState([]);
  const [answer, setAnswer] = useState({});

  const filename = props.filename;
  let length = questions_and_answers.length;

  const getQuestionsAndAnswers = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/qa?fileName=${filename}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Unable to fetch questions: ${errorMessage}`);
      }
      const data = await response.json();
      setquestions_and_answers(data);
      console.log(data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    getQuestionsAndAnswers();
  }, [filename, length, answer]);

  const handleAnswerChange = (question, event) => {
    setAnswer((prevAnswers) => ({
      ...prevAnswers,
      [question]: event.target.value,
    }));
  };

  const handleDelete = async (question_to_delete) => {
    const response = await fetch(
      `http://localhost:3000/api/qa?fileName=${filename}&question=${question_to_delete}`,
      {
        method: "DELETE",
      }
    );
    if (response.ok) {
      console.log("Question and Answer deleted successfully");
      getQuestionsAndAnswers();
    } else {
      console.log("Question and Answer deletion failed");
    }
  };

  const handleUpdateAnswer = async (question, answer, filename) => {
    if (answer === undefined) {
      console.error("No answer for question: " + question);
      return;
    }

    const response = await fetch(`http://localhost:3000/api/qa`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question,
        answer: answer,
        fileName: filename,
      }),
    });
    if (response.ok) {
      console.log("Answer updated successfully");
      getQuestionsAndAnswers();
      setAnswer((prevAnswers) => ({ ...prevAnswers, [question]: "" }));
    } else {
      console.log("Answer update failed");
    }
  };

  //   return (
  //     <div className="container">
  //       <table className="table is-striped is-hoverable is-fullwidth">
  //         <thead>
  //           <tr>
  //             <th>Question</th>
  //             <th>Answer</th>
  //             <th>Update Answer</th>
  //             <th>Action</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {questions_and_answers.map((q_and_a) => (
  //             <tr key={q_and_a.question}>
  //               <td>{q_and_a.question}</td>
  //               <td>{q_and_a.answer}</td>
  //               <td>
  //                 <div className="field">
  //                   <div className="control">
  //                     <input
  //                       className="input is-small"
  //                       type="text"
  //                       value={answer[q_and_a.question] || ""}
  //                       onChange={(event) =>
  //                         handleAnswerChange(q_and_a.question, event)
  //                       }
  //                     />
  //                   </div>
  //                 </div>
  //               </td>
  //               <td>
  //                 <button
  //                   className="button is-small is-link"
  //                   onClick={() =>
  //                     handleUpdateAnswer(
  //                       q_and_a.question,
  //                       answer[q_and_a.question],
  //                       filename
  //                     )
  //                   }
  //                 >
  //                   Update Answer
  //                 </button>
  //                 <button
  //                   className="button is-small is-danger"
  //                   onClick={() => handleDelete(q_and_a.question)}
  //                 >
  //                   Delete
  //                 </button>
  //               </td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>
  //   );
  return (
    <div className="container">
      <table className="table is-striped is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>Question</th>
            <th>Answer</th>
            <th>Update/Add Answer</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {questions_and_answers.map((q_and_a) => (
            <tr key={q_and_a.question}>
              <td>
                <div style={{ width: "9vw", overflowWrap: "break-word" }}>
                  {q_and_a.question}
                </div>
              </td>
              <td>
                <div style={{ width: "9vw", overflowWrap: "break-word" }}>
                  {q_and_a.answer}
                </div>
              </td>
              <td>
                <div className="field">
                  <div className="control">
                    <input
                      className="input is-small"
                      style={{
                        width: "80%",
                        overflow: "auto",
                      }}
                      type="text"
                      value={answer[q_and_a.question] || ""}
                      onChange={(event) =>
                        handleAnswerChange(q_and_a.question, event)
                      }
                    />
                    <button
                      style={{ width: "20%" }}
                      className="button is-small is-link"
                      onClick={() =>
                        handleUpdateAnswer(
                          q_and_a.question,
                          answer[q_and_a.question],
                          filename
                        )
                      }
                    >
                      <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                  </div>
                </div>
              </td>
              <td>
                <button
                  className="button is-small is-danger"
                  onClick={() => handleDelete(q_and_a.question)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionAndAnswer;
