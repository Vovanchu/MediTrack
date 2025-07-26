import React from "react";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import ProfileCard from "./ProfileCard/ProfileCard";
import "./UserProfile.scss";
import ProfileSections from "./ProfileSections/ProfileSections";
import ProfileStats from "./ProfileStats/ProfileStats";

export default function Profile() {
  return (
    <section className="profile-page">
      <NavBar />

      <div className="profile-content">
        <h1>My Profile</h1>
        <p>Manage your personal information and health data</p>

        <ProfileCard />

        <ProfileSections />

        <ProfileStats />
      </div>

      <Footer />
    </section>
  );
}
