import React, { useEffect, useState } from "react";
import "../styles/profile.css";
import axios from "axios";
import toast from "react-hot-toast";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/Loading";
import fetchData from "../helper/apiCall";
import jwt_decode from "jwt-decode";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import convertToBase64 from "../helper/convertImage";

// API base URL is set in apiCall.js

function Profile() {
  const { userId } = jwt_decode(localStorage.getItem("token"));
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const [file, setFile] = useState("");
  const [formDetails, setFormDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    age: "",
    mobile: "",
    gender: "neither",
    address: "",
    password: "",
    confpassword: "",
  });

  // Fetch user profile details on mount
  const getUser = async () => {
    try {
      dispatch(setLoading(true));
      // ✅ Fixed: Use correct API endpoint
      const temp = await fetchData(`/api/users/getuser/${userId}`);
      setFormDetails({
        ...temp,
        password: "",
        confpassword: "",
        mobile: temp.mobile ?? "",
        age: temp.age ?? "",
      });
      setFile(temp.pic);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      toast.error("Failed to load profile.");
      console.error(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  // Handle file input change
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  // Handle input changes
  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit updated profile data
  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      const {
        firstname,
        lastname,
        email,
        age,
        mobile,
        address,
        gender,
        password,
        confpassword,
      } = formDetails;

      // Validation
      if (!email) return toast.error("Email should not be empty");
      if (firstname.length < 3)
        return toast.error("First name must be at least 3 characters long");
      if (lastname.length < 3)
        return toast.error("Last name must be at least 3 characters long");
      if (password.length > 0 && password.length < 5)
        return toast.error("Password must be at least 5 characters long");
      if (password !== confpassword)
        return toast.error("Passwords do not match");

      await toast.promise(
        axios.put(
          "/api/users/updateprofile",
          {
            firstname,
            lastname,
            age,
            mobile,
            address,
            gender,
            email,
            password: password || undefined,
            pic: file, // Add profile picture to update
          },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          pending: "Updating profile...",
          success: "Profile updated successfully",
          error: "Unable to update profile",
        }
      );

      setFormDetails((prev) => ({ ...prev, password: "", confpassword: "" }));
    } catch (error) {
      toast.error("Unable to update profile");
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <section className="register-section flex-center">
          <div className="profile-container flex-center">
            <h2 className="form-heading">Profile</h2>
            
            {/* Profile Picture Section */}
            <div className="profile-pic-section flex-center">
              <img
                src={file || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                alt="profile"
                className="profile-pic"
              />
              <input
                type="file"
                accept="image/*"
                onChange={onUpload}
                className="profile-pic-input"
                id="profile-pic-input"
              />
              <label htmlFor="profile-pic-input" className="profile-pic-label">
                Change Photo
              </label>
            </div>

            <form onSubmit={formSubmit} className="register-form">
              <div className="form-same-row">
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
              </div>
              <div className="form-same-row">
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={formDetails.email}
                  onChange={inputChange}
                  required
                />
                <select
                  name="gender"
                  value={formDetails.gender}
                  className="form-input"
                  onChange={inputChange}
                >
                  <option value="neither">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="form-same-row">
                <input
                  type="number"
                  name="age"
                  className="form-input"
                  placeholder="Enter your age"
                  value={formDetails.age}
                  onChange={inputChange}
                  min={0}
                />
                <input
                  type="tel"
                  name="mobile"
                  className="form-input"
                  placeholder="Enter your mobile number"
                  value={formDetails.mobile}
                  onChange={inputChange}
                />
              </div>
              <textarea
                name="address"
                className="form-input"
                placeholder="Enter your address"
                value={formDetails.address}
                onChange={inputChange}
                rows="2"
              />
              <div className="form-same-row">
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Enter new password"
                  value={formDetails.password}
                  onChange={inputChange}
                />
                <input
                  type="password"
                  name="confpassword"
                  className="form-input"
                  placeholder="Confirm new password"
                  value={formDetails.confpassword}
                  onChange={inputChange}
                />
              </div>
              <button type="submit" className="btn form-btn">
                Update
              </button>
            </form>
          </div>
        </section>
      )}
      <Footer />
    </>
  );
}

export default Profile;
