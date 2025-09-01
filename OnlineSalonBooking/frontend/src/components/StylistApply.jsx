import React, { useState } from "react";
import toast from "react-hot-toast";
import "../styles/stylistapply.css";
import axios from "axios";
import convertToBase64 from "../helper/convertImage";

// API base URL is set in apiCall.js

function StylistApply() {
  const [formDetails, setFormDetails] = useState({
    specialization: "",
    experience: "",
    rate: "",
    timing: "Timing",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState("");

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        toast.error("Profile picture size should be less than 5MB");
        return;
      }
      
      try {
        const base64 = await convertToBase64(file);
        setProfilePic(file);
        setProfilePicPreview(base64);
      } catch (error) {
        toast.error("Error processing image");
      }
    }
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      const { specialization, experience, rate, timing } = formDetails;

      if (!specialization || !experience || !rate || timing === "Timing") {
        return toast.error("Please fill in all fields");
      }

      // Validate experience is a positive number
      if (isNaN(experience) || experience < 0) {
        return toast.error("Please enter a valid experience in years");
      }

      // Validate rate is a positive number
      if (isNaN(rate) || rate <= 0) {
        return toast.error("Please enter a valid rate amount");
      }

      // First, update profile picture if provided
      if (profilePic) {
        try {
          await toast.promise(
            axios.put("/api/users/updateprofile",
              { pic: profilePicPreview },
              {
                headers: {
                  authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            ),
            {
              pending: "Updating profile picture...",
              success: "Profile picture updated successfully!",
              error: "Unable to update profile picture",
            }
          );
        } catch (error) {
          console.error("Profile picture update error:", error);
          // Continue with stylist application even if profile picture update fails
        }
      }

      // Submit stylist application
      await toast.promise(
        axios.post("/api/stylist/apply",
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

      // Reset form after successful submission
      setFormDetails({
        specialization: "",
        experience: "",
        rate: "",
        timing: "Timing",
      });
      setProfilePic(null);
      setProfilePicPreview("");

    } catch (error) {
      toast.error("Something went wrong");
      return error;
    }
  };

  return (
    <section className="apply-stylist-section flex-center">
      <div className="apply-stylist-container flex-center">
        <h2 className="form-heading">Apply To Be A Stylist</h2>
        <form onSubmit={formSubmit} className="register-form">
          {/* Profile Picture Upload */}
          <div className="profile-pic-upload">
            <label htmlFor="profilePic" className="profile-pic-label">
              Profile Picture (Optional)
            </label>
            <input
              type="file"
              id="profilePic"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="profile-pic-input"
            />
            {profilePicPreview && (
              <div className="profile-pic-preview">
                <img 
                  src={profilePicPreview} 
                  alt="Profile preview" 
                  className="preview-image"
                />
              </div>
            )}
          </div>
          
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
            placeholder="Enter your experience in years"
            value={formDetails.experience}
            onChange={inputChange}
            min="0"
            step="0.5"
          />
          <input
            type="number"
            name="rate"
            className="form-input"
            placeholder="Enter your rate per service (₹)"
            value={formDetails.rate}
            onChange={inputChange}
            min="1"
            step="10"
          />
          <select
            name="timing"
            value={formDetails.timing}
            className="form-input"
            id="timing"
            onChange={inputChange}
          >
            <option disabled>Timing</option>
            <option value="morning">Morning (9 AM - 12 PM)</option>
            <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
            <option value="evening">Evening (4 PM - 8 PM)</option>
            <option value="night">Night (8 PM - 11 PM)</option>
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