const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

let database_path = path.join(__dirname, 'password.json');
let database = {
    "users": [],
    "projects": {},
};

`
{
    users: [
        {
            user_name: string,
            hashed_password: string,
            salt: string,
            session_token: string,
            allowed_projects: [], 
            is_admin: boolean
        }
    ]

    projects: {
        project_name: [file_name1, file_name2, ...]
    }
}
`

try {
    if (fs.existsSync(database_path)) {
        //file exists
        password = JSON.parse(fs.readFileSync(database_path, 'utf8'));
    } else {
        fs.writeFileSync(database_path, JSON.stringify(database));
    }
} catch(err) {
    console.error(err)
}

const saveDatabase = () => {
    try {
        console.log("Saving database...")
        fs.writeFileSync(database_path, JSON.stringify(database));
        console.log("Database saved!")
    } catch(err) {
        console.error(err)
    }
}

function _generateSalt(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charsetLength = charset.length;
  
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);
  
    let salt = '';
    for (let i = 0; i < length; i++) {
      salt += charset[randomValues[i] % charsetLength];
    }
  
    return salt;
}

const _hashPassword = (password, salt) => {
    const hash = crypto.createHash('sha256');
    hash.update(password + salt);
    return hash.digest('hex');
}

const _generateSessionToken = () => {
    return uuidv4();
  }

const addUser = (username, password, is_admin) => {
    let salt = _generateSalt(16);
    let hashed_password = _hashPassword(password, salt);
    let session_token = _generateSessionToken();
    database.users.push({
        username: username,
        hashed_password: hashed_password,
        salt: salt,
        allowed_projects: [],
        session_token: null,
        is_admin: is_admin
    })
    saveDatabase();
}

const updateUserSession = (username) => {
    const user = database.users.find(user => user.username === username);
    const session_token = _generateSessionToken();
    if (!user) return;
  
    user.session_token = session_token;
    saveDatabase();
    return session_token;
}
  
const getUserBySessionToken = (session_token) => {
    return database.users.find(user => user.session_token === session_token);
}

const getUser = (username) => {
    return database.users.find(user => user.username === username);
}

const verifyPassword = (username, password) => {
    const user = database.users.find(user => user.username === username);
    if (!user) return false;
    const user_salt = user.salt;
    const user_hashed_password = user.hashed_password;
    const hashed_password = _hashPassword(password, user_salt);
    return hashed_password === user_hashed_password;
}


module.exports = {
    addUser: addUser,
}