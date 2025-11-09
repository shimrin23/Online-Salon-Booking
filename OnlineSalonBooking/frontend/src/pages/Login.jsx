import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/register.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/reducers/rootSlice";
import jwt_decode from "jwt-decode";
import fetchData from "../helper/apiCall";
import Navbar from "../components/Navbar"; // ✅ Add this import

// API base URL is set in apiCall.js

function Login() {
  const dispatch = useDispatch();
  const [formDetails, setFormDetails] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

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
    const { email, password } = formDetails;

    if (!email || !password) {
      return toast.error("Input field should not be empty");
    }
    if (password.length < 5) {
      return toast.error("Password must be at least 5 characters long");
    }

    console.log('Attempting login with baseURL:', axios.defaults.baseURL);
    // Use relative API path for dev proxy, baseURL will be set for Docker/prod
    const response = await axios.post('/api/users/login', { email, password });
    console.log('Login response:', response);
    const data = response.data;

    if (!data) {
      console.error('No response data from server');
      return toast.error("Login failed: No response from server");
    }
    
    if (!data.token) {
      console.error('Response missing token:', data);
      return toast.error("Login failed: No token received from server");
    }

    // Save token and decode
    localStorage.setItem("token", data.token);

    let decoded;
    try {
      decoded = jwt_decode(data.token);
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
      return toast.error("Received invalid token from server");
    }
    toast.success("Login successful");

    const userId = decoded.userId;
    const userData = await fetchData(`/api/users/getuser/${userId}`);

    dispatch(setUserInfo(userData));

    if (userData.isAdmin) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }

  } catch (error) {
    toast.error("Login failed. Please check your credentials.");
    console.error("Login error:", error);
  }
};


  return (
    <>
      <Navbar /> {/* ✅ Add this line */}
      <section className="register-section flex-center">
        <div className="register-container flex-center">
          <h2 className="form-heading">Sign In</h2>
          <form onSubmit={formSubmit} className="register-form">
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formDetails.email}
              onChange={inputChange}
            />
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={formDetails.password}
              onChange={inputChange}
            />
            <button type="submit" className="btn form-btn">
              Sign In
            </button>
          </form>
          <p>
            Not a user?{" "}
            <NavLink className="login-link" to={"/register"}>
              Sign up
            </NavLink>
          </p>
        </div>
      </section>
    </>
  );
}

export default Login; 