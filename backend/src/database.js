const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');

let databasePath = path.join(__dirname, 'database.json');
let database = {
    "questions" : [],
    "file_names" : {},
    "finished" : [],
}

// {
//     questions: ["question1", "questions2"],
//     file_names: {
//         "file_name1": ["answer1", "answer2"],
//         "file_name2": ["answer1", "answer2"],
//     },
//     finished: ["file_name1", "file_name2"],
// }

try {
    // Load existing data from file if it exists
    // Else create a new database
    if (fs.existsSync(databasePath)) {
        let rawdata = fs.readFileSync(databasePath);
        database = JSON.parse(rawdata);
    } else {
        initDatabase();
    }
} catch (error) {
    console.error(`Error while initializing database: ${error}`);
}

// Database
const saveDatabase = () => {
    try {
        console.log('Saving database...');
        let data = JSON.stringify(database);
        fs.writeFileSync(databasePath, data);
        console.log('Database saved!');
    } catch (error) {
        console.error(`Error while saving database: ${error}`);
    }
}

const getAllFileNames = () => {
    try {
        const all_file_names = fs.readdirSync(path.join(__dirname, '../uploads'));
        const allowedFileTypes = ['.txt', '.pdf'];
        return all_file_names.filter(file => allowedFileTypes.includes(path.extname(file)));
    } catch (error) {
        console.error(`Error while getting all filenames: ${error}`);
        return [];
    }
}

const initDatabase = () => {
    try {
        const all_file_names = getAllFileNames();
        const file_names_obj = {};
        all_file_names.forEach((file) => {
            file_names_obj[file] = [];
        })
        database = {
            "questions" : [],
            "file_names" : file_names_obj,
            "finished" : [],
        }
        saveDatabase();
    } catch (error) {
        console.error(`Error while initializing database: ${error}`);
    }
}

const updateDatabase = () => {
    try {
        const all_file_names = getAllFileNames();
        let answer = Array(database.questions.length).fill("");
        for (let file_name of all_file_names) {
            if (!database["file_names"][file_name]) {
                database["file_names"][file_name] = answer;
            }
        }
        saveDatabase();
    } catch (error) {
        console.error(`Error while updating database: ${error}`);
    }
}

// Create
const createQuestion = (question) => {
    try {
        if (database.questions.includes(question)) {
            console.log("Question already exists");
            return;
        }
        database["questions"].push(question);
        Object.keys(database["file_names"]).forEach((file) => {
            database["file_names"][file].push("");
        })
        saveDatabase(); // save the database after a new post is created
    } catch (error) {
        console.error(`Error while creating question: ${error}`);
    }
}


// Delete
const deleteQuestionAndAnswer = (question) => {
    try {
        const question_index = database["questions"].indexOf(question);
        if (question_index === -1) {
            console.log("Question not found")
            return;
        }
        database["questions"].splice(question_index, 1);
        Object.keys(database["file_names"]).forEach((file) => {
            database["file_names"][file].splice(question_index, 1);
        })
        saveDatabase();
    } catch (error) {
        console.error(`Error while deleting question and answer: ${error}`);
    }
}

// Update
const updateAnswer = (file_name, question, answer) => {
    try {
        const question_index = database["questions"].indexOf(question);
        if (question_index === -1) {
            return;
        }
        database["file_names"][file_name][question_index] = answer;
        saveDatabase();
    } catch (error) {
        console.error(`Error while updating answer: ${error}`);
    }
}

const addFinished = (file_name) => {
    try {
        database["finished"].push(file_name);
        saveDatabase();
    } catch (error) {
        console.error(`Error while making finished: ${error}`);
    }
}

const deleteFinished = (file_name) => {
    try {
        const index = database["finished"].indexOf(file_name);
        if (index === -1) {
            return;
        }
        database["finished"].splice(index, 1);
        saveDatabase();
    } catch (error) {
        console.error(`Error while deleting finished: ${error}`);
    }
}

// Get
const getEverything = () => {
    try {
        return database;
    } catch (error) {
        console.error(`Error while getting everything: ${error}`);
        return {};
    }
}

const getAllFinishedFiles = () => {
    try {
        return JSON.stringify(database["finished"]);
    } catch (error) {
        console.error(`Error while getting all finished files: ${error}`);
        return [];
    }
}

const getAllQuestions = () =>  {
    try {
        // return stringified array of all questions
        return JSON.stringify(database["questions"]);
    } catch (error) {
        console.error(`Error while getting all questions: ${error}`);
        return [];
    }
}

const getAllQuestionAndAnswerFromFileName = (file_name) => {
    try {
        if (!database["file_names"][file_name]) {
            return []
        }
        const answers = database["file_names"][file_name];
        let ret = [];
        for (let i = 0; i < database.questions.length; i++) {
            ret.push({
                question: database.questions[i],
                answer: answers[i],
            })
        }
        return ret;
    } catch (error) {
        console.error(`Error while getting all questions and answers from filename: ${error}`);
        return [];
    }
}


module.exports = {
    getAllFileNames,
    createQuestion,
    getAllQuestionAndAnswerFromFileName,
    updateAnswer,
    getEverything,
    getAllQuestions,
    deleteQuestionAndAnswer,
    updateDatabase,
    addFinished,
    deleteFinished,
    getAllFinishedFiles,
}



// const fs = require('fs');
// const path = require('path');
// const { Parser } = require('json2csv');

// let databasePath = path.join(__dirname, 'database.json');
// let database = {
//     "questions" : [],
//     "file_names" : {}
// }
// // {
// //     "questions": ["question1", "questions2"],
// //     "file_names": {
// //         "file_name1": ["answer1", "answer2"],
// //         "file_name2": ["answer1", "answer2"],
// //     }
// // }


// // Load existing data from file if it exists
// // Else create a new database
// if (fs.existsSync(databasePath)) {
//     let rawdata = fs.readFileSync(databasePath);
//     try {
//         database = JSON.parse(rawdata);
//     } catch (error) {
//         initDatabase();
//     }
// }

// const saveDatabase = () => {
//     console.log('Saving database...');
//     let data = JSON.stringify(database);
//     fs.writeFileSync(databasePath, data);
//     console.log('Database saved!');
// }

// const getAllFileNames = () => {
//     const all_file_names = fs.readdirSync(path.join(__dirname, '../uploads'));
//     const allowedFileTypes = ['.txt', '.pdf'];
//     const filteredFiles = all_file_names.filter((file) =>
//         allowedFileTypes.includes(path.extname(file))
//     );
//     return filteredFiles;
// }

// const initDatabase = () => {
//     const all_file_names = getAllFileNames();
//     const file_names_obj = {};
//     all_file_names.forEach((file) => {
//         file_names_obj[file] = [];
//     })
//     database = {
//         "questions" : [],
//         "file_names" : file_names_obj,
//     }
//     saveDatabase();
// }

// const updateDatabase = () => {
//     const all_file_names = getAllFileNames();
//     let answer = [];
//     for (let i = 0; i < database.questions.length; i++) {
//         answer.push("");
//     }
//     for (let file_name of all_file_names) {
//         if (!database["file_names"][file_name]) {
//             database["file_names"][file_name] = answer;
//         }
//     }
//     saveDatabase();
// }

// const createQuestion = (question) => {
//     if (database.questions.includes(question)) {
//         console.log("Question already exists");
//         return;
//     }
//     database["questions"].push(question);
//     Object.keys(database["file_names"]).forEach((file) => {
//         database["file_names"][file].push("");
//     })
//     saveDatabase(); // save the database after a new post is created
// }

// // Delete
// const deleteQuestionAndAnswer = (question) => {
//     const question_index = database["questions"].indexOf(question);
//     if (question_index === -1) {
//         console.log("Question not found")
//         return;
//     }
//     database["questions"].splice(question_index, 1);
//     Object.keys(database["file_names"]).forEach((file) => {
//         database["file_names"][file].splice(question_index, 1);
//     })
//     saveDatabase();
// }

// // Update
// const updateAnswer = (file_name, question, answer) => {
//     const question_index = database["questions"].indexOf(question);
//     if (question_index === -1) {
//         return;
//     }
//     database["file_names"][file_name][question_index] = answer;
//     saveDatabase();
// }

// // Get
// const getEverything = () => {
//     return JSON.stringify(database);
// }

// const getAllQuestions = () =>  {
//     // return stringified array of all questions
//     return JSON.stringify(database["questions"]);
// }

// const getAllQuestionAndAnswerFromFileName = (file_name) => {
//     if (!database["file_names"][file_name]) {
//         return []
//     }
//     const answers = database["file_names"][file_name]
//     let ret = [];
//     for (let i = 0; i < answers.length; i++) {
//         ret.push({
//             question: database.questions[i],
//             answer: answers[i],
//         })
//     }
//     return JSON.stringify(ret);
// }


// module.exports = {
//     getAllQuestionAndAnswerFromFileName,
//     updateAnswer,
//     getEverything,
//     getAllQuestions,
//     deleteQuestionAndAnswer,
// }v


