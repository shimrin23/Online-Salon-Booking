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

const AdminStylistApplications = () => {
  const [applications, setApplications] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const getAllApplications = async () => {
    try {
      dispatch(setLoading(true));
      const data = await fetchData(`/api/stylist/getpending`); // Fixed: Added /api prefix
      setApplications(data);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      toast.error("Failed to fetch stylist applications");
    }
  };

  const acceptStylist = async (userId) => {
    try {
      const confirm = window.confirm("Are you sure you want to accept this stylist?");
      if (confirm) {
        await toast.promise(
          axios.put(
            "/api/stylist/accept", // Fixed: Added /api prefix
            { id: userId },
            {
              headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          ),
          {
            success: "Application accepted",
            error: "Failed to accept stylist",
            loading: "Accepting stylist...",
          }
        );
        getAllApplications();
      }
    } catch (error) {
      toast.error("Error while accepting stylist");
    }
  };

  const rejectStylist = async (userId) => {
    try {
      const confirm = window.confirm("Are you sure you want to reject this stylist?");
      if (confirm) {
        await toast.promise(
          axios.put(
            "/api/stylist/reject", // Fixed: Added /api prefix
            { id: userId },
            {
              headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          ),
          {
            success: "Application rejected",
            error: "Failed to reject stylist",
            loading: "Rejecting stylist...",
          }
        );
        getAllApplications();
      }
    } catch (error) {
      toast.error("Error while rejecting stylist");
    }
  };

  useEffect(() => {
    getAllApplications();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section className="user-section">
          <h3 className="home-sub-heading">Stylist Applications</h3>
          {applications.length > 0 ? (
            <div className="user-container">
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Pic</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Experience</th>
                    <th>Specialization</th>
                    <th>Rate</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((ele, i) => (
                    <tr key={ele?._id}>
                      <td>{i + 1}</td>
                      <td>
                        <img
                          className="user-table-pic"
                          src={
                            ele?.userId?.pic ||
                            "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                          }
                          alt={ele?.userId?.firstname}
                        />
                      </td>
                      <td>{ele?.userId?.firstname}</td>
                      <td>{ele?.userId?.lastname}</td>
                      <td>{ele?.userId?.email}</td>
                      <td>{ele?.userId?.mobile}</td>
                      <td>{ele?.experience}</td>
                      <td>{ele?.specialization}</td>
                      <td>{ele?.fees}</td>
                      <td className="select">
                        <button
                          className="btn user-btn accept-btn"
                          onClick={() => acceptStylist(ele?.userId?._id)}
                        >
                          Accept
                        </button>
                        <button
                          className="btn user-btn"
                          onClick={() => rejectStylist(ele?.userId?._id)}
                        >
                          Reject
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

export default AdminStylistApplications;