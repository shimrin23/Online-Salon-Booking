import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../styles/notification.css";
import Empty from "../components/Empty";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import fetchData from "../helper/apiCall";
import { setLoading } from "../redux/reducers/rootSlice";
import Loading from "../components/Loading";
import "../styles/user.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const getAllNotif = async () => {
    try {
      dispatch(setLoading(true));
      console.log("Fetching notifications for user...");

      const temp = await fetchData(`/api/notification/getallnotifs`);
      console.log("Notifications received:", temp);
      setNotifications(temp);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);

      // Add proper error handling
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
        // Optionally redirect to login
        // navigate("/login");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("Failed to fetch notifications. Please check your connection.");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getAllNotif();
  }, []);

  return (
    <>
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <section className="container notif-section">
          <h2 className="page-heading">Your Notifications</h2>

          {notifications.length > 0 ? (
            <div className="notifications">
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Content</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((ele, i) => (
                    <tr key={ele._id}>
                      <td>{i + 1}</td>
                      <td>{ele.content}</td>
                      <td>{ele.updatedAt.split("T")[0]}</td>
                      <td>{ele.updatedAt.split("T")[1].split(".")[0]}</td>
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
      <Footer />
    </>
  );
};

export default Notifications;
