import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/register.css";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";


axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function Register() {
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);
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

  // Upload profile image to Cloudinary
  const onUpload = async (file) => {
    if (!file) return;
    setLoading(true);

    if (file.type === "image/jpeg" || file.type === "image/png") {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
      data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);

      try {
        const res = await fetch(process.env.REACT_APP_CLOUDINARY_BASE_URL, {
          method: "POST",
          body: data,
        });
        const result = await res.json();
        setFile(result.url.toString());
      } catch (error) {
        toast.error("Image upload failed. Please try again.");
      }
    } else {
      toast.error("Please select an image in jpeg or png format");
    }
    setLoading(false);
  };

  // Handle form submit
  const formSubmit = async (e) => {
    e.preventDefault();
    if (loading) return toast.error("Image upload in progress. Please wait.");
    if (!file) return toast.error("Please upload a profile picture.");

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
        axios.post("/user/register", {
          firstname,
          lastname,
          email,
          password,
          pic: file,
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
            type="file"
            name="profile-pic"
            id="profile-pic"
            className="form-input"
            accept="image/png, image/jpeg"
            onChange={(e) => onUpload(e.target.files[0])}
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
          <button type="submit" className="btn form-btn" disabled={loading}>
            Sign Up
          </button>
        </form>
        <p>
          Already a user?{" "}
          <NavLink className="login-link" to={"/login"}>
            Log in
          </NavLink>
        </p>
        <Link to="/" className="btn home-btn">← Back to Home</Link>
      </div>
    </section>
  );
}

export default Register;
