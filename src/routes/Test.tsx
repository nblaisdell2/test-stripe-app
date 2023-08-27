import React from "react";
import { Link } from "react-router-dom";

function Test() {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-primary font-bold text-white">
      <h1>Test Page</h1>
      <Link to={"/activity"}>Back to Activity</Link>
    </div>
  );
}

export default Test;
