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
      const data = await fetchData(`/appointment/getall`);
      setAppointments(data);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      toast.error("Failed to load appointments");
    }
  };

  useEffect(() => {
    getAllAppointments();
  }, []);

  const markAsComplete = async (appointment) => {
    try {
      await toast.promise(
        axios.put("/api/appointment/complete",  // Fixed: Added /api prefix
          {
            appointid: appointment?._id,
            stylistId: appointment?.stylistId._id,
            customerName: `${appointment?.userId?.firstname} ${appointment?.userId?.lastname}`,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          success: "Appointment marked as completed",
          error: "Failed to update appointment status",  // Fixed: Changed error message
          loading: "Completing appointment...",
        }
      );

      getAllAppointments();
    } catch (error) {
      toast.error("Error while marking complete");
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section className="user-section">
          <h3 className="home-sub-heading">All Appointments</h3>
          {appointments.length > 0 ? (
            <div className="user-container">
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Stylist</th>
                    <th>Customer</th>
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
                        {ele?.stylistId?.firstname} {ele?.stylistId?.lastname}
                      </td>
                      <td>
                        {ele?.userId?.firstname} {ele?.userId?.lastname}
                      </td>
                      <td>{ele?.date}</td>
                      <td>{ele?.time}</td>
                      <td>{ele?.createdAt?.split("T")[0]}</td>
                      <td>{ele?.updatedAt?.split("T")[1].split(".")[0]}</td>
                      <td>{ele?.status}</td>
                      <td>
                        <button
                          className={`btn user-btn accept-btn ${
                            ele?.status === "Completed" ? "disable-btn" : ""
                          }`}
                          disabled={ele?.status === "Completed"}
                          onClick={() => markAsComplete(ele)}
                        >
                          Complete
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