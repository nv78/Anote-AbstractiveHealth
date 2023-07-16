import React, { useEffect, useState } from "react";
import RedirectButton from "../components/redirectButton";
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const session_token = Cookies.get("session_token");
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [fileNames, setFileNames] = useState([]);
    const [userFileNames, setUserFileNames] = useState([]);
    const [jsonData, setJsonData] = useState(null);

    useEffect(() => {
        checkAdmin();
        getUsers();
        getAllFileNames();
    }, []);

    useEffect(() => {
        if (selectedUser) {
            getFileNamesByUser();
        }
        getEverything();
    }, [selectedUser]);

    // useEffect(() => {

    // }, []);

    const getAnswerTable = () => {
        if (!jsonData) {
            return null;
        }
        const { questions, file_names, finished } = jsonData;

        return (
            <table style={styles.table}>
                <thead>
                    <tr style={styles.headerRow}>
                        <th style={styles.headerCell}>File Name</th>
                        {questions.map((question, index) => (
                            <th key={index} style={styles.headerCell}>{question}</th>
                        ))}
                        <th style={styles.headerCell}>Finished</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(file_names).map((fileName) => (
                        userFileNames.includes(fileName) && (
                            <tr key={fileName} style={styles.row}>
                                <td style={styles.cell}>{fileName}</td>
                                {file_names[fileName].map((answer, index) => (
                                    <td key={index} style={styles.cell}>{answer}</td>
                                ))}
                                <td style={styles.cell}>
                                    {finished.includes(fileName) ? 'Yes' : 'No'}
                                </td>
                            </tr>
                        )
                    ))}
                </tbody>
            </table>
        );
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
          console.log("data", data)
          setJsonData(data); // JSON.parse is not needed as response.json() already parses the response.
        }
      };

    const checkAdmin = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/isAdmin?session_token=${session_token}`);
            if (!response.ok) {
                navigate('/');
                window.alert("You are not an admin!");
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

    const getUsers = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/AllUsername?session_token=${session_token}`);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.log("Error:", error);
        }
    };

    const getAllFileNames = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/fileNames");
            const data = await response.json();
            setFileNames(data);
        } catch (error) {
            console.log("Error:", error);
        }
    };

    const getFileNamesByUser = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/AllowedFiles?username=${selectedUser}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        },
                }
            );
            const data = await response.json();
            setUserFileNames(data);
        } catch (error) {
            console.log("Error:", error);
        }
    };

    const handleFileCheck = async (fileName, isChecked) => {
        const url = isChecked ? "/api/addAllowedFile" : "/api/deleteAllowedFile";
        const response = await fetch(`http://localhost:3000${url}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: selectedUser,
                fileName: fileName,
            }),
        });
        if (response.ok) {
            getFileNamesByUser();
        } else {
            console.error("Failed to update user file access");
        }
    };

    const getFileAccessTable = () => (
        <table style={styles.table}>
            <thead>
                <tr style={styles.headerRow}>
                    <th style={styles.headerCell}>File Name</th>
                    <th style={styles.headerCell}>Access</th>
                </tr>
            </thead>
            <tbody>
                {fileNames.map((fileName) => (
                    <tr key={fileName} style={styles.row}>
                        <td style={styles.cell}>{fileName}</td>
                        <td style={styles.cell}>
                            <input
                                type="checkbox"
                                checked={userFileNames.includes(fileName)}
                                onChange={(e) => handleFileCheck(fileName, e.target.checked)}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        // todo: change the className to admin (add the css file)
        <div className="customize">
            <h1 className="abstractivetitle">Abstractive Health</h1>
            <nav>
                <RedirectButton buttonText="Home" buttonUrl="/home" />
                <RedirectButton buttonText="Upload" buttonUrl="/upload" />
                <RedirectButton buttonText="Customize" buttonUrl="/customize" />
                <RedirectButton buttonText="Annotate" buttonUrl="/annotate" />
                <RedirectButton buttonText="Download" buttonUrl="/download" />
                <RedirectButton buttonText="Admin" buttonUrl="/admin" />
            </nav>
            <div>
                <label htmlFor="userSelect">Select User:</label>
                <select id="userSelect" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                    <option value="">-- Select User --</option>
                    {users.map((user, index) => (
                        <option key={index} value={user}>{user}</option>
                    ))}
                </select>
            </div>
            {selectedUser && getFileAccessTable()}
            {getAnswerTable()}

        </div>
    );
};

// Define styles outside of the AdminPage component
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


export default AdminPage;
