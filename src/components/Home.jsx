import React from "react";
const Home = ({ APIHealth }) => {
  return (
    <div className="app-container">
      <h1>Hello, World!</h1>
      <p>API Status: {APIHealth}</p>
      <p>test</p>
    </div>
  );
};
export default Home;
