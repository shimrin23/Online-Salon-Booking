import React, { useState } from "react";
import "../styles/stylistapply.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// API base URL is set in apiCall.js

const ApplyStylist = () => {
  const navigate = useNavigate();
  const [formDetails, setFormDetails] = useState({
    specialization: "",
    experience: "",
    fees: "",
    timing: "morning",
  });

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const btnClick = async (e) => {
    e.preventDefault();
    try {
      await toast.promise(
        axios.post(
          "/api/stylist/apply", // Keep relative path
          {
            ...formDetails,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          success: "Stylist application sent successfully",
          error: "Unable to send stylist application",
          loading: "Sending stylist application...",
        }
      );

      navigate("/");
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <>
      <Navbar />
      <section
        className="apply-stylist-section flex-center"
        id="contact"
      >
        <div className="apply-stylist-container flex-center">
          <h2 className="form-heading">Apply as a Stylist</h2>
          <form className="register-form">
            <input
              type="text"
              name="specialization"
              className="form-input"
              placeholder="Enter your specialization (e.g., Haircut, Coloring, Styling)"
              value={formDetails.specialization}
              onChange={inputChange}
            />
            <input
              type="number"
              name="experience"
              className="form-input"
              placeholder="Enter your experience (in years)"
              value={formDetails.experience}
              onChange={inputChange}
            />
            <input
              type="number"
              name="fees"
              className="form-input"
              placeholder="Enter your rate per service (₹)"
              value={formDetails.fees}
              onChange={inputChange}
            />
            <button
              type="submit"
              className="btn form-btn"
              onClick={btnClick}
            >
              Apply
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ApplyStylist;
