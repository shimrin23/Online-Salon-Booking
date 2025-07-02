import React, { useState } from "react";
import toast from "react-hot-toast";
import "../styles/doctorapply.css"; // You can rename this file to stylistapply.css if you want
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function StylistApply() {
  const [formDetails, setFormDetails] = useState({
    specialization: "",
    experience: "",
    rate: "",
    timing: "Timing",
  });

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      const { specialization, experience, rate, timing } = formDetails;

      if (!specialization || !experience || !rate || timing === "Timing") {
        return toast.error("Please fill in all fields");
      }

      await toast.promise(
        axios.post(
          "/stylist/applyforstylist", // Update backend route accordingly
          {
            specialization,
            experience,
            rate,
            timing,
          },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          pending: "Submitting application...",
          success: "Thank you for applying as a stylist!",
          error: "Unable to submit application",
          loading: "Submitting application...",
        }
      );
    } catch (error) {
      toast.error("Something went wrong");
      return error;
    }
  };

  return (
    <section className="apply-doctor-section flex-center">
      <div className="apply-doctor-container flex-center">
        <h2 className="form-heading">Apply To Be A Stylist</h2>
        <form onSubmit={formSubmit} className="register-form">
          <input
            type="text"
            name="specialization"
            className="form-input"
            placeholder="Enter your specialization (e.g., Haircut, Coloring)"
            value={formDetails.specialization}
            onChange={inputChange}
          />
          <input
            type="text"
            name="experience"
            className="form-input"
            placeholder="Enter your experience in years"
            value={formDetails.experience}
            onChange={inputChange}
          />
          <input
            type="text"
            name="rate"
            className="form-input"
            placeholder="Enter your rate per service"
            value={formDetails.rate}
            onChange={inputChange}
          />
          <select
            name="timing"
            value={formDetails.timing}
            className="form-input"
            id="timing"
            onChange={inputChange}
          >
            <option disabled>Timing</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
            <option value="night">Night</option>
          </select>
          <button type="submit" className="btn form-btn">
            Apply
          </button>
        </form>
      </div>
    </section>
  );
}

export default StylistApply;
