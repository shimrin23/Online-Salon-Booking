import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "./Loading";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import Empty from "./Empty";
import fetchData from "../helper/apiCall";
import "../styles/user.css";

// API base URL is set in apiCall.js

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const getAllAppointments = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(
        `/api/appointment/getall`
      );
      console.log("Raw appointments data:", temp); // Debug log
      setAppointments(temp);
      dispatch(setLoading(false));
    } catch (error) {
      toast.error("Failed to fetch appointments");
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getAllAppointments();
  }, []);

  const markComplete = async (ele) => {
    try {
      console.log("=== MARK COMPLETE START ===");
      console.log("Appointment data:", ele);
      
      // Toggle between Completed and Pending
      const newStatus = ele.status === "Completed" ? "Pending" : "Completed";
      console.log("New status will be:", newStatus);

      const requestData = {
        appointid: ele._id,
        stylistId: ele?.stylistId?._id || '',
        stylistName: `${ele?.stylistId?.userId?.firstname || ''} ${ele?.stylistId?.userId?.lastname || ''}`.trim(),
        status: newStatus
      };

      console.log("Request data being sent:", requestData);
      console.log("API endpoint:", "/api/appointment/complete");
      console.log("Request method: PUT");

      // Update local state IMMEDIATELY for instant UI update
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment._id === ele._id 
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );

      console.log("Local state updated, making API call...");

      // Make API call and handle response
      const response = await axios.put(
        "/api/appointment/complete",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("API response received:", response);
      console.log("=== MARK COMPLETE SUCCESS ===");
      
      // Only show success message after API call succeeds
      toast.success(`Appointment marked as ${newStatus.toLowerCase()}`);
      
    } catch (error) {
      console.error("=== MARK COMPLETE ERROR ===");
      console.error("Full error object:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);
      console.error("Error URL:", error.config?.url);
      console.error("Error method:", error.config?.method);
      
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
      {loading ? (
        <Loading />
      ) : (
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
      )}
    </>
  );
};

export default AdminAppointments;