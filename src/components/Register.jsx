import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../axios-services";
import useAuth from "../hooks/useAuth";

const Register = () => {
    // contactNumber
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    let navigation = useNavigate();
    const { setIsLoggedIn, setToken } = useAuth();
    return (
        <div>
            <form onSubmit={async (e) => {
                e.preventDefault();
                if (password === confirmPassword) {
                    const result = await registerUser(firstName, lastName, password, email, contactNumber);
                    alert("Registered");
                    setIsLoggedIn(true);
                    setToken(result.token);
                    navigation("/");
                } else {
                    alert("Check data");
                }
            }}>
                <label>First Name: </label>
                <input type="text" placeholder="FirstName" value={firstName} onChange={(e) => setFirstName(e.target.value)}></input>
                <br/>
                <label>Last name: </label>
                <input type="text" placeholder="LastName" value={lastName} onChange={(e) => setLastName(e.target.value)}></input>
                <br/>
                <label>Password: </label>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                <br/>
                <label>Confirm password: </label>
                <input type="password" placeholder="ConfirmPassword" onChange={(e) => setConfirmPassword(e.target.value)}></input>
                <br/>
                <label>Email: </label>
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                <br/>
                <label>Contact number: </label>
                <input type="text" placeholder="ContactNumber" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)}></input>
                <br/>   
                <button type="submit">Register</button>
            </form>
        </div>
    );
};
export default Register;