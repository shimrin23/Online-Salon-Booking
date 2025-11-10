import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import AboutUs from "../components/AboutUs";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import HomeCircles from "../components/HomeCircles";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin and redirect to dashboard
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        if (decoded.isAdmin) {
          navigate("/dashboard");
          return;
        }
      } catch (error) {
        // Invalid token, continue showing home page
      }
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
      <Hero />
      <AboutUs />
      <HomeCircles />
      <Footer />
    </>
  );
};

export default Home;
