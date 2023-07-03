const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');

let databasePath = path.join(__dirname, 'database.json');
let database = {}

// Load existing data from file if it exists
if (fs.existsSync(databasePath)) {
    let rawdata = fs.readFileSync(databasePath);
    try {
        database = JSON.parse(rawdata);
    } catch (error) {
        console.error(`Error parsing database.json: ${error}`);
        // Handle error as appropriate
    }
}

const saveDatabase = () => {
    console.log('Saving database...');
    let data = JSON.stringify(database);
    fs.writeFileSync(databasePath, data);
    console.log('Database saved!');
}

const createQuestionAndAnswer = (question, answer, file_name) => {
    const new_post = {
        question: question,
        answer: answer
    }
    if (!database[file_name]) {
        database[file_name] = [new_post];
    } else {
        database[file_name].push(new_post);
    }
    saveDatabase(); // save the database after a new post is created
    return new_post
}

const getQuestionAndAnswer = (file_name) => {
    if (!database[file_name]) {
        return []
    }
    return database[file_name]
}

const deleteQuestionAndAnswer = (file_name, question, answer) => {
    if (!database[file_name]) {
        return;
    }
    database[file_name] = database[file_name].filter(
        (post) => post.question !== question
    )
    saveDatabase();
}

const updateAnswer = (file_name, question, answer) => {
    console.log(answer)
    if (!database[file_name]) {
        return;
    }
    for (let i = 0; i < database[file_name].length; i++) {
        if (database[file_name][i].question === question) {
            database[file_name][i].answer = answer;
            console.log(database[file_name])
        }
    }
    saveDatabase();
}

const getEverything = () => {
    return JSON.stringify(database);
}

const getAllQuestions = () =>  {
    // return stringified array of all questions
    let ret = [];
    return database[Object.keys(database)[0]].map((post) => post.question)
}

const deleteOneQuestionForAll = (question) => {
    // delete question from all files
    for (let file_name in database) {
        database[file_name] = database[file_name].filter(
            (post) => post.question !== question
        )
    }
    saveDatabase();
}

getAllQuestions();

module.exports = {
    createQuestionAndAnswer,
    getQuestionAndAnswer,
    deleteQuestionAndAnswer,
    updateAnswer,
    getEverything,
    getAllQuestions,
    deleteOneQuestionForAll,
}
