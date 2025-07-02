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

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const getAllNotif = async () => {
    try {
      dispatch(setLoading(true));
      // Adjust the API if you want salon-specific notifications (e.g., booking updates, offers)
      const temp = await fetchData(`/notification/getallnotifs`);
      setNotifications(temp);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
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
