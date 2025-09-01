import React from "react";
import { FaUsers, FaUserTie, FaCalendarAlt, FaCrown, FaList, FaEnvelope } from "react-icons/fa";
import "../styles/adminHome.css";

const AdminHome = () => {
  // Extended stats for student project
  const stats = [
    { title: "Total Users", value: "45", icon: <FaUsers />, color: "#8B4513" },
    { title: "Active Stylists", value: "8", icon: <FaUserTie />, color: "#DAA520" },
    { title: "Today's Appointments", value: "5", icon: <FaCalendarAlt />, color: "#CD853F" },
    { title: "Total Appointments", value: "23", icon: <FaList />, color: "#B8860B" },
    { title: "Pending Applications", value: "3", icon: <FaEnvelope />, color: "#A0522D" },
  ];

  return (
    <div className="admin-home">
      {/* Simple Header */}
      <div className="admin-header">
        <div className="header-content">
          <div className="welcome-container">
            <FaCrown className="crown-icon" />
            <div>
              <h1 className="welcome-text">Welcome to Salon Admin</h1>
              <p className="subtitle">Manage your salon easily</p>
            </div>
          </div>
        </div>
      </div>

      {/* Extended Stats */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon-container" style={{ backgroundColor: stat.color }}>
              <div className="stat-icon">
                {stat.icon}
              </div>
            </div>
            <div className="stat-details">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-title">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHome;
