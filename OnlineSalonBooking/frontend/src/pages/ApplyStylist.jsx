import React, { useState } from "react";
import "../styles/contact.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const ApplyStylist = () => {
  const navigate = useNavigate();
  const [formDetails, setFormDetails] = useState({
    specialization: "",
    experience: "",
    rate: "",
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
          "/stylist/applyforstylist",
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
        className="register-section flex-center apply-stylist"
        id="contact"
      >
        <div className="register-container flex-center contact">
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
              name="rate"
              className="form-input"
              placeholder="Enter your rate per service (₹)"
              value={formDetails.rate}
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
