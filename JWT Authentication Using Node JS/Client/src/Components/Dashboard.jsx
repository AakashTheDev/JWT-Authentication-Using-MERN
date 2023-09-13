import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function Dashboard() {
  const [status, setStatus] = useState("");
  const nav = useNavigate();
  axios.defaults.withCredentials = true;

  // useEffect(() => {
  //   axios.get("http://localhost:3001/Dashboard").then((res) => {
  //     if (res.data === "Success") {
  //       setStatus("Successfully Logged In");
  //     } else {
  //       nav("/");
  //     }
  //   });
  // }, []);

  return (
    <div className="flex justify-center items-center min-h-screen font-bold tracking-widest">
      Welcome to the Dashboard
    </div>
  );
}

export default Dashboard;
