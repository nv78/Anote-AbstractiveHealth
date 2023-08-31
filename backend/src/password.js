const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const db = require("./database.js");

let database_path = path.join(__dirname, "password.json");
let database = [];

/*
The database structure is now an array of users with each user having the following structure:

{
    user_name: string,
    hashed_password: string,
    salt: string,
    session_token: string,
    allowed_files: [file_name1, file_name2, …], 
    is_admin: boolean
}
*/

try {
  if (fs.existsSync(database_path)) {
    //file exists
    database = JSON.parse(fs.readFileSync(database_path, "utf8"));
  } else {
    fs.writeFileSync(database_path, JSON.stringify(database));
  }
} catch (err) {
  console.error(err);
}

/**
 * Saves the current state of the database to the filesystem
 */
const saveDatabase = () => {
  try {
    console.log("Saving database...");
    fs.writeFileSync(database_path, JSON.stringify(database));
    console.log("Database saved!");
  } catch (err) {
    console.error(err);
  }
};

/**
 * Generates a random salt for password hashing
 * @param {number} length - The length of the salt to generate
 * @returns {string} The generated salt
 */
function _generateSalt(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charsetLength = charset.length;

  let salt = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsetLength);
    salt += charset[randomIndex];
  }

  return salt;
}

/**
 * Hashes a password using a given salt
 * @param {string} password - The password to hash
 * @param {string} salt - The salt to use for hashing
 * @returns {string} The hashed password
 */
const _hashPassword = (password, salt) => {
  const hash = crypto.createHash("sha256");
  hash.update(password + salt);
  return hash.digest("hex");
};

/**
 * Generates a new session token
 * @returns {string} The generated session token
 */
const _generateSessionToken = () => {
  return uuidv4();
};

/**
 * Adds a new user to the database
 * @param {string} username - The username of the new user
 * @param {string} password - The password of the new user
 * @param {boolean} is_admin - Whether the new user is an admin
 */
const addUser = (username, password, is_admin) => {
  let salt = _generateSalt(16);
  let hashed_password = _hashPassword(password, salt);
  let session_token = _generateSessionToken();
  database.push({
    username: username,
    hashed_password: hashed_password,
    salt: salt,
    allowed_files: [],
    session_token: null,
    is_admin: is_admin,
  });
  saveDatabase();
};

/**
 * Updates the session token of a user
 * @param {string} username - The username of the user
 * @returns {string} The new session token
 */
const updateUserSession = (username) => {
  const user = database.find((user) => user.username === username);
  const session_token = _generateSessionToken();
  if (!user) return;

  user.session_token = session_token;
  saveDatabase();
  return session_token;
};

/**
 * Gets a user by their session token
 * @param {string} session_token - The session token of the user
 * @returns {Object} The user
 */
const getUserBySessionToken = (session_token) => {
  return database.find((user) => user.session_token === session_token);
};

/**
 * Gets a user by their username
 * @param {string} username - The username of the user
 * @returns {Object} The user
 */
const getUser = (username) => {
  let u = database.find((user) => user.username === username);
  return u;
};

/**
 * Gets all users from the database.
 * @returns {Array} Array of all users.
 */
const getAllUsers = () => {
  return database; // Assuming database is an array containing all users.
};

/**
 * Verifies a user's password
 * @param {string} username - The username of the user
 * @param {string} password - The password to verify
 * @returns {boolean} Whether the password is correct
 */
const verifyPassword = (username, password) => {
  const user = database.find((user) => user.username === username);
  if (!user) return;
  const user_salt = user.salt;
  const user_hashed_password = user.hashed_password;
  const hashed_password = _hashPassword(password, user_salt);
  return hashed_password === user_hashed_password;
};

/**
 * Checks if a user is an admin
 * @param {string} session_token - The session token of the user
 * @returns {boolean} Whether the user is an admin
 */
const isAdmin = (session_token) => {
  const user = getUserBySessionToken(session_token);
  if (!user || !user.is_admin) {
    return false;
  }
  return true;
};

/**
 * Gets all usernames excluding the user identified by the session token
 * @param {string} session_token - The session token of the user to exclude
 * @returns {Array} The usernames
 */
const getAllUsername = (session_token) => {
  const usernames = database
    .map((user) => {
      if (user.session_token !== session_token) {
        return user.username;
      }
    })
    .filter((username) => username !== undefined);
  return usernames;
};

/**
 * Gets all allowed files of a user by their username
 * @param {string} username - The username of the user
 * @returns {Array} The allowed files
 */
const getAllowedFiles = (username) => {
  const user = getUser(username);
  if (!user) return [];
  if (user.is_admin) {
    return db.getAllFileNames();
  }
  return user.allowed_files;
};

/**
 * Add allowed files of a user by their username
 * @param {string} username - The username of the user
 * @param {string} file_name - The file name to add
 */
const addAllowedFile = (username, file_name) => {
  const user = getUser(username);
  if (!user) return;
  user.allowed_files.push(file_name);
  saveDatabase();
};

/**
 * Delete allowed files of a user by their username
 * @param {string} username - The username of the user
 * @param {string} file_name - The file name to delete
 */
const deleteAllowedFile = (username, file_name) => {
  const user = getUser(username);
  if (!user) return;
  user.allowed_files = user.allowed_files.filter((file) => file !== file_name);
  saveDatabase();
};

/**
 * Delete a file from the allowed_files of all users.
 * @param {string} file_name - The file name to delete
 */
const deleteAllowedFileFromAllUsers = (file_name) => {
  // Assuming you have a method to fetch all users.
  // This method could vary based on your database structure and method of storage.
  const allUsers = getAllUsers();

  allUsers.forEach((user) => {
    user.allowed_files = user.allowed_files.filter(
      (file) => file !== file_name
    );
  });

  saveDatabase(); // Save the changes to the database
};

module.exports = {
  addUser: addUser,
  updateUserSession: updateUserSession,
  getUserBySessionToken: getUserBySessionToken,
  getUser: getUser,
  verifyPassword: verifyPassword,
  isAdmin: isAdmin,
  getAllUsername: getAllUsername,
  getAllowedFiles: getAllowedFiles,
  addAllowedFile: addAllowedFile,
  deleteAllowedFile: deleteAllowedFile,
  deleteAllowedFileFromAllUsers: deleteAllowedFileFromAllUsers,
};

// const fs = require('fs');
// const path = require('path');
// const crypto = require('crypto');
// const { v4: uuidv4 } = require('uuid');

// let database_path = path.join(__dirname, 'password.json');
// let database = {
//     "users": [],
//     "projects": {},
// };

// `
// {
//     users: [
//         {
//             user_name: string,
//             hashed_password: string,
//             salt: string,
//             session_token: string,
//             allowed_projects: [],
//             is_admin: boolean
//         }
//     ]

//     projects: {
//         project_name: [file_name1, file_name2, ...]
//     }
// }
// `

// try {
//     if (fs.existsSync(database_path)) {
//         //file exists
//         database = JSON.parse(fs.readFileSync(database_path, 'utf8'));
//     } else {
//         fs.writeFileSync(database_path, JSON.stringify(database));
//     }
// } catch(err) {
//     console.error(err)
// }

// const saveDatabase = () => {
//     try {
//         console.log("Saving database...")
//         fs.writeFileSync(database_path, JSON.stringify(database));
//         console.log("Database saved!")
//     } catch(err) {
//         console.error(err)
//     }
// }

// function _generateSalt(length) {
//     const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//     const charsetLength = charset.length;

//     let salt = '';
//     for (let i = 0; i < length; i++) {
//       const randomIndex = Math.floor(Math.random() * charsetLength);
//       salt += charset[randomIndex];
//     }

//     return salt;
// }

// const _hashPassword = (password, salt) => {
//     const hash = crypto.createHash('sha256');
//     hash.update(password + salt);
//     return hash.digest('hex');
// }

// const _generateSessionToken = () => {
//     return uuidv4();
//   }

// // for user to sign up
// const addUser = (username, password, is_admin) => {
//     let salt = _generateSalt(16);
//     let hashed_password = _hashPassword(password, salt);
//     let session_token = _generateSessionToken();
//     database.users.push({
//         username: username,
//         hashed_password: hashed_password,
//         salt: salt,
//         allowed_projects: [],
//         session_token: null,
//         is_admin: is_admin
//     })
//     saveDatabase();
// }

// // for user to log in
// const updateUserSession = (username) => {
//     const user = database.users.find(user => user.username === username);
//     const session_token = _generateSessionToken();
//     if (!user) return;

//     user.session_token = session_token;
//     saveDatabase();
//     return session_token;
// }

// const getUserBySessionToken = (session_token) => {
//     return database.users.find(user => user.session_token === session_token);
// }

// const getUser = (username) => {
//     let u = database.users.find(user => user.username === username)
//     return u
// }

// const verifyPassword = (username, password) => {
//     const user = database.users.find(user => user.username === username);
//     if (!user) return;
//     const user_salt = user.salt;
//     const user_hashed_password = user.hashed_password;
//     const hashed_password = _hashPassword(password, user_salt);
//     return hashed_password === user_hashed_password;
// }

// // check admin by session_token
// const isAdmin = (session_token) => {
//     const user = getUserBySessionToken(session_token);
//     if (!user || !user.is_admin) {
//       return false;
//     }
//     return true;
// }

// // get all username but exclude self
// const getAllUsername = (session_token) => {
//     const usernames = database.users.map((user) => {
//         if (user.session_token !== session_token) {
//             return user.username;
//         }
//     }).filter((username) => username !== undefined);
//     return usernames;
// }

// module.exports = {
//     addUser: addUser,
//     updateUserSession: updateUserSession,
//     getUserBySessionToken: getUserBySessionToken,
//     getUser: getUser,
//     verifyPassword: verifyPassword,
//     isAdmin: isAdmin,
//     getAllUsername: getAllUsername,

// }
