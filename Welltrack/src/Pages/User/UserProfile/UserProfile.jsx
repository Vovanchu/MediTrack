import React from "react";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";

export default function Profile() {
  return (
    <section>
      <NavBar />

      <h1>My Profile</h1>
      <p>Manage your personal information and health data</p>
      
      <Footer />
    </section>
  );
}
