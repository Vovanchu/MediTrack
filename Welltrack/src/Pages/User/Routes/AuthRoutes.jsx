// Routes/AuthRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

// Головна сторінка профілю
import MyProfile from "../UserProfile/UserProfile.jsx";

// Всі вкладені маршрути профілю
import MyProfileRoutes from "./my_profile/UserInformationRoutes.jsx";
import ServicesPageSubpages from "./ServicesPageSubpages/ServicesPageSubpages.jsx";

// Інші сторінки
import Home from "../Home/Home.jsx";
import Services from "../ServicesPage/ServicesPage.jsx";
import MyEvents from "../MyEvents/MyEvents.jsx";
import SymptomDiary from "../SymptomDiary/SymptomDiary.jsx";
import HealthPlan from "../HealthPlan/HealthPlan.jsx";

export default function AuthRoutes() {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        {/* Головна сторінка профілю */}
        <Route path="/my-profile" element={<MyProfile />} />

        {/* Всі підсторінки профілю*/}
        <Route path="/my-profile/*" element={<MyProfileRoutes />} />

        {/* Всі підсторінки сервіси*/}
        <Route path="/services/*" element={<ServicesPageSubpages />} />

        {/* Інші сторінки */}
        <Route path="/home" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/symptom-diary" element={<SymptomDiary />} />
        <Route path="/health-plan" element={<HealthPlan />} />
      </Route>
    </Routes>
  );
}
