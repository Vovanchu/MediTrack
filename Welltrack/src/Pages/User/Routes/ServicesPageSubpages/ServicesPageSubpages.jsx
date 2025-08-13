import React from "react";
import { Routes, Route } from "react-router-dom";

import DoctorVisits from "../../ServicesPage/subpages/DoctorVisits/DoctorVisits";
import Vaccination from "../../ServicesPage/subpages/Vaccination/VaccinationPage";
import Analysis from "../../ServicesPage/subpages/Analysis/Analysis";
import BloodDonation from "../../ServicesPage/subpages/BloodDonation/BloodDonation";
import MedicationsPage from "../../ServicesPage/subpages/Taking Medications/Medications";

export default function MyProfileRoutes() {
  return (
    <Routes>
      <Route path="doctor-visits" element={<DoctorVisits />} />
      <Route path="vaccination" element={<Vaccination />} />
      <Route path="analysis" element={<Analysis />} />
      <Route path="blood-donation" element={<BloodDonation />} />
      <Route path="medications" element={<MedicationsPage />} />
    </Routes>
  );
}
