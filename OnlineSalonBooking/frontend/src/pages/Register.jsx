import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/register.css";
import axios from "axios";
import toast from "react-hot-toast";
// Removed unused Link import
import Navbar from "../components/Navbar"; // ✅ Add this import

// API base URL is set in apiCall.js

function Register() {
  // removed unused loading state
  const [formDetails, setFormDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confpassword: "",
  });

  const navigate = useNavigate();

  // Handle input changes
  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const formSubmit = async (e) => {
    e.preventDefault();

    const { firstname, lastname, email, password, confpassword } = formDetails;

    if (!firstname || !lastname || !email || !password || !confpassword) {
      return toast.error("All fields are required");
    }
    if (firstname.length < 3) {
      return toast.error("First name must be at least 3 characters long");
    }
    if (lastname.length < 3) {
      return toast.error("Last name must be at least 3 characters long");
    }
    if (password.length < 5) {
      return toast.error("Password must be at least 5 characters long");
    }
    if (password !== confpassword) {
      return toast.error("Passwords do not match");
    }

    try {
      await toast.promise(
        // ⚡ Edited this line: Added full backend URL
        axios.post("/api/users/register", { 
          firstname,
          lastname,
          email,
          password,
        }),
        {
          pending: "Registering user...",
          success: "User registered successfully",
          error: "Unable to register user",
        }
      );
      navigate("/login");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error(error);
    }
  };

  return (
    <>
      <Navbar /> {/* ✅ Add this line */}
      <section className="register-section flex-center">
        <div className="register-container flex-center">
          <h2 className="form-heading">Sign Up</h2>
          <form onSubmit={formSubmit} className="register-form">
            <input
              type="text"
              name="firstname"
              className="form-input"
              placeholder="Enter your first name"
              value={formDetails.firstname}
              onChange={inputChange}
              required
            />
            <input
              type="text"
              name="lastname"
              className="form-input"
              placeholder="Enter your last name"
              value={formDetails.lastname}
              onChange={inputChange}
              required
            />
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formDetails.email}
              onChange={inputChange}
              required
            />
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={formDetails.password}
              onChange={inputChange}
              required
            />
            <input
              type="password"
              name="confpassword"
              className="form-input"
              placeholder="Confirm your password"
              value={formDetails.confpassword}
              onChange={inputChange}
              required
            />
            <button type="submit" className="btn form-btn">
              Sign Up
            </button>
          </form>
          <p>
            Already a user?{" "}
            <NavLink className="login-link" to={"/login"}>
              Log in
            </NavLink>
          </p>
        </div>
      </section>
    </>
  );
}

export default Register;
