import React from "react";

const Item = ({ item, isLoggedIn }) => {
    return (
        <div className="SingleItem" key={item._id}>
            <img src={picture} alt={item.name} />
            <h2>{item.name}</h2>
            <p>Description: {item.description}</p>
            <p>Price: {item.price}</p>
            {isLoggedIn ? (
                <button> addToCart</button>
            ) : null}
        </div>
    );
};
export default Item;