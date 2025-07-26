// Routes/AuthRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

// Головна сторінка профілю
import MyProfile from "../UserProfile/UserProfile.jsx";

// Всі вкладені маршрути профілю
import MyProfileRoutes from "./my_profile/UserInformationRoutes.jsx";

// Інші сторінки
import Services from "../Services/Services.jsx";
import MyEvents from "../MyEvents/MyEvents.jsx";
import SymptomDiary from "../SymptomDiary/SymptomDiary.jsx";
import HealthPlan from "../HealthPlan/HealthPlan.jsx";

export default function AuthRoutes() {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        {/* Головна сторінка профілю */}
        <Route path="/my-profile" element={<MyProfile />} />

        {/* Всі підсторінки профілю */}
        <Route path="/my-profile/*" element={<MyProfileRoutes />} />

        {/* Інші сторінки */}
        <Route path="/services" element={<Services />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/symptom-diary" element={<SymptomDiary />} />
        <Route path="/health-plan" element={<HealthPlan />} />
      </Route>
    </Routes>
  );
}
