import AuthContext from "./AuthContext";
import React, { useState, useEffect } from "react";
import { getItems, getMe, getOrder, getOrderItem } from "../axios-services";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [token, setToken] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [items, setItems] = useState({});
    const [orders, setOrders] = useState({});

    useEffect(() => {
        async function getUser() {
            const localToken = localStorage.getItem("token");
            if (localToken) {
                const newUser = await getMe(localStorage.email);
                setUser(newUser);
                setToken(localToken);
                setIsLoggedIn(true);
            } else {
                setUser({});
            }
        }
        getUser();
    }, [token]);

    useEffect(() => {
        const fetchItems = async () => {
            const importedItems = await getItems();
            setItems(importedItems);
        };
        fetchItems();
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            if (user && user.id) {
                const importedOrders = await getOrder(user.id);
                if (importedOrders && importedOrders.length) {
                    importedOrders.map(async (order) => {
                        const temp = await getOrderItem(order.id);
                        order.product = temp;
                    });
                    setOrders(importedOrders);
                }
            }
        }
        fetchOrders();
    }, [token, isLoggedIn, user]);
    return (<AuthContext.Provider value={{ user, setUser, token, setToken, isLoggedIn, setIsLoggedIn, items, setItems, orders, setOrders }}>{children}</AuthContext.Provider>);
}
export default AuthProvider;