import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../axios-services";
import useAuth from "../hooks/useAuth";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    let navigation = useNavigate();
    const { setIsLoggedIn, setToken } = useAuth();
    return (
        <div>
            <form onSubmit={async (e) => {
                e.preventDefault();
                const result = await loginUser(email, password);
                if (result && result != null) {
                    alert("Logged in");
                    setIsLoggedIn(true);
                    setToken(result.token);
                    navigation("/");
                } else {
                    alert("Login failed. Check data or register");
                }
            }}>
                <label>Email</label>
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                <br />
                <label>Password</label>
                <input type="text" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                <br />
                <button type="submit">Log in</button>
            </form>
        </div>
    );
};

export default Login;