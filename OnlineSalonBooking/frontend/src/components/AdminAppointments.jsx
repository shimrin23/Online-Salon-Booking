import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
// Removed unused redux imports
import Empty from "./Empty";
import fetchData from "../helper/apiCall";
import "../styles/user.css";

// API base URL is set in apiCall.js

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  // redux dispatch removed (unused)

  const getAllAppointments = async () => {
    try {
      const temp = await fetchData(
        `/api/appointment/getall`
      );
      setAppointments(temp);
    } catch (error) {
      toast.error("Failed to fetch appointments");
    }
  };

  useEffect(() => {
    getAllAppointments();
  }, []);

  const markComplete = async (ele) => {
    try {
      // Toggle between Completed and Pending
      const newStatus = ele.status === "Completed" ? "Pending" : "Completed";

      const requestData = {
        appointid: ele._id,
        stylistId: ele?.stylistId?._id || '',
        stylistName: `${ele?.stylistId?.userId?.firstname || ''} ${ele?.stylistId?.userId?.lastname || ''}`.trim(),
        status: newStatus
      };

      // Update local state IMMEDIATELY for instant UI update
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment._id === ele._id 
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );

      // Make API call and handle response
  await axios.put(
        "/api/appointment/complete",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      // Only show success message after API call succeeds
      toast.success(`Appointment marked as ${newStatus.toLowerCase()}`);
      
    } catch (error) {
      // If API call fails, revert the local state
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment._id === ele._id 
            ? { ...appointment, status: ele.status } // Revert to original status
            : appointment
        )
      );
      
      // Show error message
      if (error.response?.data) {
        toast.error(`Error: ${error.response.data}`);
      } else {
        toast.error("Failed to update appointment status");
      }
    }
  };

  return (
    <>
      <section className="user-section">
        <h3 className="home-sub-heading">Your Booked Appointments</h3>
        
        {appointments.length > 0 ? (
          <div className="appointments">
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Stylist</th>
                  <th>Client</th>
                  <th>Appointment Date</th>
                  <th>Appointment Time</th>
                  <th>Booking Date</th>
                  <th>Booking Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((ele, i) => (
                  <tr key={ele?._id}>
                    <td>{i + 1}</td>
                    <td>
                      {ele?.stylistId?.userId?.firstname && ele?.stylistId?.userId?.lastname 
                        ? `${ele.stylistId.userId.firstname} ${ele.stylistId.userId.lastname}`
                        : "Stylist not found"
                      }
                    </td>
                    <td>
                      {ele?.userId?.firstname + " " + ele?.userId?.lastname}
                    </td>
                    <td>{ele?.date}</td>
                    <td>{ele?.time}</td>
                    <td>{ele?.createdAt?.split("T")[0]}</td>
                    <td>{ele?.updatedAt?.split("T")[1]?.split(".")[0]}</td>
                    <td>{ele?.status}</td>
                    <td>
                      <button
                        className={`btn user-btn ${
                          ele?.status === "Completed" ? "completed-btn" : "pending-btn"
                        }`}
                        onClick={() => markComplete(ele)}
                      >
                        {ele?.status === "Completed" ? "Completed" : "Mark Complete"}
                      </button>
                    </td>
                  </tr>
                ))}
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

export default AdminAppointments;