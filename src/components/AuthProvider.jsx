import AuthContext from "./AuthContext";
import React, { useState, useEffect } from "react";

const AuthProvider=({children})=>{
    const [user,setUser]=useState({});
    const [token,setToken]=useState(null);
    const [isLoggedIn,setIsLoggedIn]=useState(false);
    const [items,setItems]=useState({});
    const [orders,setOrders]=useState({});
}