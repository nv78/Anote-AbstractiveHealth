import React, { useEffect, useState } from "react";
import fetch from "cross-fetch";
import QuestionAndAnswer from "../components/questionAndAnswer";
import Cookies from "js-cookie";
import "bulma/css/bulma.css";
import "../styling/Display.css"; // Import custom CSS file for styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const DisplayFile = () => {
  const [fileNames, setFileNames] = useState([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [filePreview, setFilePreview] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const session_token = Cookies.get("session_token");

  const [questions_and_answers, setquestions_and_answers] = useState([]);
  const [answer, setAnswer] = useState({});

  const filename = fileNames[selectedFileIndex];
  let length = questions_and_answers.length;

  useEffect(() => {
    getQuestionsAndAnswers();
    checkAdmin();
  }, [filename]);

  useEffect(() => {
    getFileNames();
  }, []);

  useEffect(() => {
    fetchFinishedFiles();
  }, [fileNames, selectedFileIndex]);

  const checkAdmin = async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/isAdmin?session_token=${session_token}`);
        if (response.ok) {
            setIsAdmin(true);
        }
    } catch (error) {
        console.log("Error:", error);
    }
};
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
      // load original answers into state
      const originalAnswers = {};
      data.forEach((q_and_a) => {
        if(q_and_a.answer) originalAnswers[q_and_a.question] = q_and_a.answer;
      });
      setAnswer(originalAnswers);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // const getQuestionsAndAnswers = async () => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:3000/api/qa?fileName=${filename}`,
  //       {
  //         method: "GET",
  //       }
  //     );
  //     if (!response.ok) {
  //       const errorMessage = await response.text();
  //       throw new Error(`Unable to fetch questions: ${errorMessage}`);
  //     }
  //     const data = await response.json();
  //     setquestions_and_answers(data);
  //   } catch (error) {
  //     console.log("Error:", error);
  //   }
  // };


  const handleAnswerChange = (question, event) => {
    setAnswer((prevAnswers) => ({
      ...prevAnswers,
      [question]: event.target.value,
    }));
  };

  const handleUpdateAnswer = async (question, answer, filename) => {
    if (answer === undefined) {
      console.error("No answer for question: " + question);
      return;
    }
  
    const response = await fetch(`http://localhost:3000/api/answer`, {
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
      setAnswer((prevAnswers) => ({ ...prevAnswers, [question]: answer })); // Just update the answer for the specific question in the state, not empty it
    } else {
      console.log("Answer update failed");
    }
    handleNext();
  };
  

  const getFileNames = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/AllowedFiles?session_token=${session_token}`
      );
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Unable to fetch file names: ${errorMessage}`);
      }
      const data = await response.json();
      const finishedFilesResponse = await fetch(
        "http://localhost:3000/api/getFinished"
      );
      const finishedFiles = await finishedFilesResponse.json();
      const sortedData = data.sort(
        (a, b) => finishedFiles.includes(a) - finishedFiles.includes(b)
      );
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
      } else if (fileType === "csv") {
        const reader = new FileReader();
        reader.onload = function (event) {
          const csvData = event.target.result;
          const lines = csvData.split("\n");
          const rows = lines.map(line => line.split(","));
          setFilePreview(
            <table>
              {rows.map(row => (
                <tr>
                  {row.map(cell => <td>{cell}</td>)}
                </tr>
              ))}
            </table>
          );
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
        throw new Error(
          `Error updating finished state for file: ${response.statusText}`
        );
      }
      setIsFinished(isChecked); // Update the isFinished state
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleThumbsUp = async (question, filename) => {
    const response = await fetch(`http://localhost:3000/api/thumbsUp`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question,
        fileName: filename,
      }),
    });
    if (response.ok) {
      console.log("Thumbs up updated successfully");
    } else {
      console.log("Thumbs up update failed");
    }
  };
  
  const handleThumbsDown = async (question, filename) => {
    const response = await fetch(`http://localhost:3000/api/thumbsDown`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question,
        fileName: filename,
      }),
    });
    if (response.ok) {
      console.log("Thumbs down updated successfully");
    } else {
      console.log("Thumbs down update failed");
    }
  };
  

  return (
    <div className="mx-auto w-3/4 my-5">
      <div className="flex flex-row">
        <div className="h-full w-3/4">{filePreview}</div>
        <div className="mx-auto w-1/2">
          {/* <QuestionAndAnswer filename={fileNames[selectedFileIndex]} /> */}
          <div className="text-white h-full bg-gray-800 rounded-r-lg overflow-auto">
            <h2 className="text-white font-semibold text-xl mt-8 mx-10 text-left">
              {fileNames[selectedFileIndex]}
            </h2>
            {questions_and_answers.map((q_and_a) => (
              <>
                <div key={q_and_a.question} className="p-4">
                  <div className="flex flex-row">
                    <span className="w-5 h-5 -mr-3 mt-2 bg-slate-700 transform rotate-45"></span>
                    <p className="bg-slate-700 p-4 rounded-lg">
                      {q_and_a.question}
                    </p>
                  </div>

                  <div className="flex flex-col items-center mt-5">
                  <textarea
                    id="message"
                    rows="15"
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder={q_and_a.answer ? "" : "Write your answer here..."}
                    value={
                      answer.hasOwnProperty(q_and_a.question)
                        ? answer[q_and_a.question]
                        : q_and_a.answer || ""
                    }
                    
                    onChange={(event) =>
                      handleAnswerChange(q_and_a.question, event)
                    }
                  ></textarea>

                    <div className="flex flex-row">
                      <button
                        className="text-white bg-slate-400 p-2 rounded-md mx-2"
                        onClick={handlePrevious}
                        disabled={selectedFileIndex === 0}
                      >
                        <FontAwesomeIcon className="pr-2" icon={faArrowLeft} />
                        Previous
                      </button>
                      <button
                        className="button bg-slate-800 text-white hover:text-black hover:bg-white"
                        onClick={() =>
                          handleUpdateAnswer(
                            q_and_a.question,
                            answer[q_and_a.question],
                            filename
                          )
                        }
                      >
                        {" "}
                        Confirm
                        <FontAwesomeIcon className="pl-2" icon={faArrowRight} />
                      </button>
                    </div>
                    {isAdmin && (
                      <button
                        className="button bg-slate-800 text-white hover:text-black hover:bg-white mx-2"
                        onClick={() => handleThumbsUp(q_and_a.question, filename)}
                      >
                        Thumbs Up
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        className="button bg-slate-800 text-white hover:text-black hover:bg-white mx-2"
                        onClick={() => handleThumbsDown(q_and_a.question, filename)}
                      >
                        Thumbs Down
                      </button>
                    )}
                  </div>
                </div>
              </>
            ))}
          </div>
          {/* <button
            className="text-white bg-slate-400 p-2 rounded-md mx-2"
            onClick={handlePrevious}
            disabled={selectedFileIndex === 0}
          >
            <FontAwesomeIcon className="pr-2" icon={faArrowLeft} />
            Previous
          </button>
          <button
            className="text-white bg-slate-400 p-2 px-4 rounded-md mx-2"
            onClick={handleNext}
            disabled={selectedFileIndex === fileNames.length - 1}
          >
            Next
            <FontAwesomeIcon className="pl-2" icon={faArrowRight} />
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default DisplayFile;
