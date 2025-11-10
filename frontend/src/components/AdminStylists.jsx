import React, { useState, useEffect } from "react";
import axios from "axios";
import fetchData from "../helper/apiCall";
import toast from "react-hot-toast";
import Empty from "./Empty";
import "../styles/user.css";

// API base URL is set in apiCall.js

const AdminStylists = () => {
  const [stylists, setStylists] = useState([]);

  const getAllStylists = async () => {
    try {
      console.log("Fetching stylists..."); // Debug log
      
      const data = await fetchData(`/api/stylist/getall`);
      console.log("Stylists data received:", data); // Debug log
      console.log("Data type:", typeof data); // Debug log
      console.log("Data length:", Array.isArray(data) ? data.length : 'Not an array'); // Debug log
      
      if (Array.isArray(data)) {
        setStylists(data);
      } else {
        console.error("Data is not an array:", data);
        setStylists([]);
        toast.error("Invalid data format received");
      }
      
    } catch (error) {
      console.error("Error fetching stylists:", error); // Debug log
      console.error("Error response:", error.response?.data); // Debug log
      setStylists([]);
    }
  };

  const deleteStylist = async (userId) => {
    try {
      const confirm = window.confirm("Are you sure you want to remove this stylist?");
      if (confirm) {
        await toast.promise(
          axios.put("/api/stylist/delete", // Fixed: Added /api prefix
            { userId },
            {
              headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          ),
          {
            success: "Stylist removed successfully",
            error: "Unable to remove stylist",
            loading: "Removing stylist...",
          }
        );
        getAllStylists();
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getAllStylists();
  }, []);

  return (
    <>
      <section className="user-section">
          <h3 className="home-sub-heading">All Stylists</h3>
          
          {/* Debug info */}
          <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
            Total stylists: {stylists.length}
          </div>
          
          {stylists && stylists.length > 0 ? (
            <div className="user-container">
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Pic</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Mobile No.</th>
                    <th>Experience</th>
                    <th>Specialization</th>
                    <th>Rate</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {stylists.map((ele, i) => {
                    console.log("Rendering stylist:", ele); // Debug log
                    return (
                      <tr key={ele?._id || i}>
                        <td>{i + 1}</td>
                        <td>
                          <img
                            className="user-table-pic"
                            src={
                              ele?.userId?.pic ||
                              "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                            }
                            alt={ele?.userId?.firstname || 'Stylist'}
                          />
                        </td>
                        <td>{ele?.userId?.firstname || 'N/A'}</td>
                        <td>{ele?.userId?.lastname || 'N/A'}</td>
                        <td>{ele?.userId?.email || 'N/A'}</td>
                        <td>{ele?.userId?.mobile || 'N/A'}</td>
                        <td>{ele?.experience || 'N/A'}</td>
                        <td>{ele?.specialization || 'N/A'}</td>
                        <td>{ele?.fees || 'N/A'}</td>
                        <td className="select">
                          <button
                            className="btn user-btn"
                            onClick={() => deleteStylist(ele?.userId?._id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty />
          )}
        </section>
    </>
  );
};

export default AdminStylists;
