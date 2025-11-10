import React from "react";
import {
  FaHome,
  FaList,
  FaUser,
  FaUserTie,
  FaUsers,
  FaEnvelope,
} from "react-icons/fa";
import "../styles/sidebar.css";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/reducers/rootSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const sidebar = [
    {
      name: "Home",
      path: "/dashboard",
      icon: <FaHome />,
    },
    {
      name: "Users",
      path: "/dashboard/users",
      icon: <FaUsers />,
    },
    {
      name: "Stylists",
      path: "/dashboard/stylists",
      icon: <FaUserTie />,
    },
    {
      name: "Appointments",
      path: "/dashboard/appointments",
      icon: <FaList />,
    },
    {
      name: "Applications",
      path: "/dashboard/applications",
      icon: <FaEnvelope />,
    },
    {
      name: "Profile",
      path: "/dashboard/profile",
      icon: <FaUser />,
    },
  ];

  const logoutFunc = () => {
    dispatch(setUserInfo({}));
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <section className="sidebar-section flex-center">
        <div className="sidebar-container">
          {/* Brand Section */}
          <div className="sidebar-brand">
            <h2>GlamourGlow</h2>
            <p>Admin Dashboard</p>
          </div>

          {/* Navigation Menu */}
          <ul>
            {sidebar.map((ele, i) => (
              <li key={i} className={location.pathname === ele.path ? 'active' : ''}>
                {ele.icon}
                <NavLink 
                  to={ele.path}
                  className={location.pathname === ele.path ? 'active' : ''}
                >
                  {ele.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Logout Section */}
          <div className="logout-container" onClick={logoutFunc}>
            <MdLogout />
            <p>Logout</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Sidebar;
