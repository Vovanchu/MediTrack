import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const token = localStorage.getItem("token"); // чи є токен після логіну

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
