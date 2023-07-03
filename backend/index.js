const db = require("./src/database.js");
const express = require("express");
const multer = require("multer");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; font-src 'self' http://localhost:3000;"
  );
  next();
});

app.post("/api/upload", upload.array("files"), function (req, res, next) {
  // req.files is array of `files` files
  // req.body will contain the text fields, if there were any
  res.send("Successfully uploaded!");
});

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

app.post("/api/qa", (req, res) => {
  const question = req.body.question;
  const answer = req.body.answer;
  const file_name = req.body.fileName;
  const new_post = db.createQuestionAndAnswer(question, answer, file_name);
  res.json(new_post);
});

app.get("/api/qa", (req, res) => {
  const file_name = req.query.fileName;
  const posts = db.getQuestionAndAnswer(file_name);
  res.json(posts);
});

app.delete("/api/qa", (req, res) => {
  const question = req.query.question;
  const file_name = req.query.fileName;
  db.deleteQuestionAndAnswer(file_name, question);
  res.send("Successfully deleted");
});

app.get("/api/all_questions", (req, res) => {
  const all_questions = db.getAllQuestions();
  // res send string
  res.json(all_questions);
});

app.patch("/api/qa", (req, res) => {
  const question = req.body.question;
  const answer = req.body.answer;
  const file_name = req.body.fileName;
  db.updateAnswer(file_name, question, answer);
  res.send("Successfully updated");
});

app.get("/api/everything", (req, res) => {
  const everything = db.getEverything();
  res.json(everything);
});

app.delete("/api/one_question_for_all", (req, res) => {
  const question = req.query.question;
  db.deleteOneQuestionForAll(question);
  res.send("Successfully deleted");
});

app.use(express.static(path.join(__dirname, "uploads")));

const server = app.listen(3000, () => {
  console.log(`Server running on port ${server.address().port}`);
});
