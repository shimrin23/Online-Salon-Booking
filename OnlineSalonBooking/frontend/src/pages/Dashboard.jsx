import React from "react";
import AdminApplications from "../components/AdminStylistApplications";
import AdminAppointments from "../components/AdminAppointments";
import AdminStylists from "../components/AdminStylists"; // Renamed component
import Sidebar from "../components/Sidebar";
import Users from "../components/Users";

const Dashboard = (props) => {
  const { type } = props;

  return (

    <section className="layout-section">
      <div className="layout-container">
        <Sidebar />
        {type === "users" ? (
          <Users />
        ) : type === "stylists" ? (
          <AdminStylists />
        ) : type === "applications" ? (
          <AdminApplications />
        ) : type === "appointments" ? (
          <AdminAppointments />
        ) : null}
      </div>
    </section>
  );
};

export default Dashboard;
