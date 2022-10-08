import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({isLoggedIn,setIsLoggedIn}) => {
    return (<div>
        <Link to="/">
            <button>Home</button>
        </Link>
        {isLoggedIn?null:(
            <Link to="/user/register">
            <button>Register</button>
        </Link>
        )}
        {isLoggedIn?(<Link to="/" onClick={()=>{localStorage.removeItem("token");
        setIsLoggedIn(false)}}>
            <button>Log out</button>
        </Link>):(
            <Link to="/user/login">
            <button>Log in</button>
        </Link>
        )}
        
    </div>)
}
export default Navbar;