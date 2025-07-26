import React from "react";
import { Routes, Route } from "react-router-dom";

import UserInformation from "../../MyProfile/UserInformation/UserInformation";
import HealthIndicators from "../../MyProfile/HealthIndicators/HealthIndicators";
import HealthRecord from "../../MyProfile/HealthRecord/HealthRecord";
import MedicalDocuments from "../../MyProfile/MedicalDocuments/MedicalDocuments";
import Settings from "../../MyProfile/Settings/Settings";

export default function MyProfileRoutes() {
  return (
    <Routes>
      <Route path="user-information" element={<UserInformation />} />
      <Route path="health-indicators" element={<HealthIndicators />} />
      <Route path="health-record" element={<HealthRecord />} />
      <Route path="medical-documents" element={<MedicalDocuments />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
}
