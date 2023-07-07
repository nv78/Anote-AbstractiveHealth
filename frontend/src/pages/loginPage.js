import React, { useState, useEffect} from "react";

const LoginPage = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    // TODO
    const handleSubmit = (e) => {
        console.log("username: " + username)
    }

    return (
        <div className="login">
            <h2>Login Form</h2>
            <div>
                <label>Email</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            
            <div>
                <label>Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <div>
                <button type="submit" onClick={handleSubmit}>
                    Login
                </button>
            </div>
        </div>

    )
}

export default LoginPage;