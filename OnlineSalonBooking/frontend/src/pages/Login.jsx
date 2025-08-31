import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/register.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/reducers/rootSlice";
import jwt_decode from "jwt-decode";
import fetchData from "../helper/apiCall";
import { Link } from "react-router-dom";

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

      // Edited: Added console.log to debug request
      console.log("Sending login request:", { email, password });

      const { data } = await toast.promise(
        // Edited: Ensure backend endpoint matches your API
        axios.post("/api/users/login", { email, password }),
        {
          pending: "Logging in...",
          success: "Login successful",
          error: "Unable to login user",
          loading: "Logging user...",
        }
      );

      // Edited: Added console.log to see backend response
      console.log("Backend response:", data);

      localStorage.setItem("token", data.token);

      // Decode token once
      const decoded = jwt_decode(data.token);
      const userId = decoded.userId;

      // Fetch full user info
      const userData = await fetchData(`/user/getuser/${userId}`);

      // Dispatch full user info
      dispatch(setUserInfo(userData));

      // Navigate to home page
      navigate("/");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error("Login error:", error); // Edited: more explicit error log
    }
  };

  return (
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
            Register
          </NavLink>
        </p>
       <Link to="/" className="btn home-btn">← Back to Home</Link>

      </div>
    </section>
  );
}

export default Login;
