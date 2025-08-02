import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import ProfileCard from "./ProfileCard/ProfileCard";
import "./UserProfile.scss";
import ProfileSections from "./ProfileSections/ProfileSections";
import ProfileStats from "./ProfileStats/ProfileStats";
import { fetchProfile } from "../../../API/accounts"; // або звідки в тебе йде імпорт функції API

export default function Profile() {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await fetchProfile();
        setUserProfile(response.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    getProfile();
  }, []);

  return (
    <section className="profile-page">
      <NavBar />

      <div className="profile-content">
        <h1>{userProfile ? `Hello, ${userProfile.username}` : "Loading..."}</h1>
        <p>Manage your personal information and health data</p>

        <ProfileCard />

        <ProfileSections />

        <ProfileStats />
      </div>

      <Footer />
    </section>
  );
}
