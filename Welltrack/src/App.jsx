import React from "react";
import { Routes, Route } from "react-router-dom";

import "./main.scss";

import Home from "./Pages/Public/Main/Main.jsx";
import Login from "./Pages/Public/LogIn/LogIn.jsx";
import SignUp from "./Pages/Public/SignUp/SignUp.jsx";
import ResetPassword from "./Pages/Public/ResetPassword/ResetPassword.jsx";

import AuthRoutes from "./Pages/User/Routes/AuthRoutes.jsx";

export default function App() {
  return (
    <Routes>
      {/* Публічні сторінки */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Приватні маршрути */}
      <Route path="/*" element={<AuthRoutes />} />
    </Routes>
  );
}
