import React from "react";
import { Routes, Route } from "react-router-dom";

import DoctorVisits from "../../ServicesPage/subpages/DoctorVisits/DoctorVisits";

export default function MyProfileRoutes() {
  return (
    <Routes>
      <Route path="doctor-visits" element={<DoctorVisits />} />
    </Routes>
  );
}
