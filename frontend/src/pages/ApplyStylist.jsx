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
      // Validate form data before sending
      if (!formDetails.specialization || !formDetails.experience || !formDetails.fees) {
        return toast.error("Please fill in all fields");
      }

      // Validate experience is a positive number
      if (isNaN(formDetails.experience) || formDetails.experience < 0) {
        return toast.error("Please enter a valid experience in years");
      }

      // Validate fees is a positive number
      if (isNaN(formDetails.fees) || formDetails.fees <= 0) {
        return toast.error("Please enter a valid rate amount");
      }

      const response = await axios.post(
        "/api/stylist/apply",
        {
          specialization: formDetails.specialization,
          experience: Number(formDetails.experience),
          fees: Number(formDetails.fees),
          timing: formDetails.timing,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Handle both new application and updated application responses
      if (response.status === 201) {
        toast.success("Stylist application submitted successfully!");
      } else if (response.status === 200) {
        toast.success("Stylist application updated successfully!");
      }

      navigate("/");
    } catch (error) {
      console.error("Application error:", error);
      if (error.response?.status === 401) {
        toast.error("Please login first");
        navigate("/login");
      } else if (error.response?.data) {
        toast.error(error.response.data);
      } else {
        toast.error("An error occurred: " + error.message);
      }
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