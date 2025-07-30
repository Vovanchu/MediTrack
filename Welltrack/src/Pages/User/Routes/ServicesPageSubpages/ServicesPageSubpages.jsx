import React from "react";
import { Routes, Route } from "react-router-dom";

import DoctorVisits from "../../ServicesPage/subpages/DoctorVisits/DoctorVisits";
import Vaccination from "../../ServicesPage/subpages/Vaccination/VaccinationPage";

export default function MyProfileRoutes() {
  return (
    <Routes>
      <Route path="doctor-visits" element={<DoctorVisits />} />
      <Route path="vaccination" element={<Vaccination />} />
    </Routes>
  );
}
