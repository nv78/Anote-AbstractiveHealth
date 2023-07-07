const express = require("express");
const multer = require("multer");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const db = require("./src/database.js");
const pw = require("./src/password.js");
const cookieParser = require("cookie-parser");
const app = express();


function cleanText(text) {
    const cleanedText = text.replace(/[^\w\s.]|_/g, '').replace(/\s+/g, '').toLowerCase();
    return cleanedText;
  }
  
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      let file_name = file.originalname;
      file_name = cleanText(file_name)
      cb(null,file_name);
    },
  });
  
const upload = multer({ storage: storage });

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader(
      "Content-Security-Policy",
      "default-src 'none'; font-src 'self' http://localhost:3000;"
  );
  next();
});

// Signup
app.post("/api/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const user = pw.getUser(username);
    if (user !== undefined) {
      res.status(401).send("User already exists");
      return;
    }
    pw.addUser(username, password);
    res.send("Successfully signed up");
});

// Login
app.post("/api/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = pw.getUser(username);
  
  if (user === undefined) {
    res.status(401).send("User not found");
    return;
  }

  if (!pw.verifyPassword(username, password)) {
    res.status(401).send("Incorrect password");
    return;
  }

  // Save this session identifier in the database associated with the user
  const session_token = pw.updateUserSession(username);
  
  // Set a cookie in the user's browser with this session identifier
  res.cookie('session_token', session_token, { httpOnly: true }); // httpOnly flag to protect against cross-site scripting attacks

  res.send("Successfully logged in");
});

app.get('/api/logout', (req, res) => {
  res.clearCookie('session_id');
  res.send('Logged out successfully');
});


  
// Upload a file
app.post("/api/upload", upload.array("files"), function (req, res, next) {
    // req.files is array of `files` files
    // req.body will contain the text fields, if there were any
    db.updateDatabase();
    res.send("Successfully uploaded!");
  });
  
  // Get all file names
  app.get("/api/fileNames", (req, res) => {
    const directoryPath = path.join(__dirname, "uploads");
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.log("Unable to scan directory: " + err);
        res.status(500).send("Unable to scan directory");
        return;
      }
      const allowedFileTypes = [".txt", ".pdf"];
      const filteredFiles = files.filter((file) =>
        allowedFileTypes.includes(path.extname(file))
      );
      res.json(filteredFiles);
    });
  });
  
// Get one file by file name
app.get("/api/files", (req, res) => {
const directoryPath = path.join(__dirname, "uploads");
fs.readdir(directoryPath, (err, files) => {
    if (err) {
    console.log("Unable to scan directory: " + err);
    res.status(500).send("Unable to scan directory");
    return;
    }

    const allowedFileTypes = [".txt", ".pdf"];
    const filteredFiles = files.filter((file) =>
    allowedFileTypes.includes(path.extname(file))
    );

    for (const file of filteredFiles) {
    if (file === req.query.filename) {
        // Send file to client
        res.sendFile(path.join(directoryPath, req.query.filename));
        return;
    }
    }

    // If we got here, file was not found
    res.status(404).send("File not found");
});
});

// Create a question
app.post("/api/question", (req, res) => {
const question = req.body.question;
db.createQuestion(question);
res.json(question);
});

// Get all questions
app.get("/api/question", (req, res) => {
const file_name = req.query.fileName;
const questions = db.getAllQuestions();
res.json(questions);
});

// Delete a question by itself
app.delete("/api/question", (req, res) => {
const question = req.query.question;
db.deleteQuestionAndAnswer(question);
res.send("Successfully deleted");
});

// Update answer of a question in a designated file
app.patch("/api/answer", (req, res) => {
const question = req.body.question;
const answer = req.body.answer;
const file_name = req.body.fileName;
db.updateAnswer(file_name, question, answer);
res.send("Successfully updated");
});

// Get everything
app.get("/api/everything", (req, res) => {
const everything = db.getEverything();
res.json(everything);
});

app.get("/api/qa", (req, res) => {
const file_name = req.query.fileName;
const qa = db.getAllQuestionAndAnswerFromFileName(file_name);
res.json(qa);
});

// Update finished
app.patch("/api/addFinished", (req, res) => {
const file_name = req.body.fileName;
db.addFinished(file_name);
res.send("Successfully updated");
});

// Delete from finished
app.patch("/api/deleteFinished", (req, res) => {
const file_name = req.body.fileName;
db.deleteFinished(file_name);
res.send("Successfully updated");
});

// Get finished
app.get("/api/getFinished", (req, res) => {
const finished = db.getAllFinishedFiles();
res.json(finished);
});

module.exports = app;