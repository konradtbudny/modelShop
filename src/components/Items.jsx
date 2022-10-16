import React from "react";
import Item from "./Item";

const Items = ({ items, isLoggedIn }) => {
    const [searchTerm, setSearchTerm] = useState("");
    return (
        <div classname="MainPosts>">
            <h1>Products</h1>
            <input classname="ProductInputBar"
                type="search"
                placeholder="Search products"
                onChange={(e) => { setSearchTerm(e.target.value); }}>

            </input>
        </div>
    )
}
export default Items;