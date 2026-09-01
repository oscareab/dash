import axios from "axios";
import { useState, useEffect } from "react";
function Login({ onLogin }) {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [error, setError] = useState(null)

    const [serverName, setServerName] = useState(null)

    useEffect(() => {
        const fetchServerName = async () => {
            const response = await axios.get('/name');
            setServerName(response.data.name);
        };

        fetchServerName();
    }, [])

    const handleUsername = (event) => {
        setUsername(event.target.value)
    }

    const handlePassword = (event) => {
        setPassword(event.target.value)
    }

    async function login(username, password) {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                username,
                password
            })
        });

        if (!response.ok) {
            setError("Login Failed")
            return
        }

        onLogin()
    }


    return (
        <div className="h-screen md:max-w-1/3 mx-auto flex justify-center items-center">
            <div className="justify-center flex flex-col gap-2">
                <h1>{serverName ?? "Server"}</h1>
                <p>dashboard</p>
                <label htmlFor="username">Username</label>
                <input type="text" onChange={handleUsername} />
                <label htmlFor="password">Password</label>
                <input type="password" onChange={handlePassword} />
                <button disabled={!username || !password} className="w-min" onClick={() => login(username, password)}>Login</button>
                <p>{error}</p>
            </div>
        </div>
    )
}

export default Login;