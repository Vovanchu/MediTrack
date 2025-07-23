import React from "react";
import { Routes, Route } from "react-router-dom";

import "./main.scss";

import Home from "./Pages/Public/Main/Main.jsx";
import Login from "./Pages/Public/LogIn/LogIn.jsx";
import SignUp from "./Pages/Public/SingUp/SingUp.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}
