import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    let navigate = useNavigate();
    return (<div>
        <Link to="/">
            <button>Home</button>
        </Link>
    </div>)
}
export default Navbar;