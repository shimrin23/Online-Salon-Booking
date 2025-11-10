import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Loading from "./Loading";

const SmartHome = () => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const decoded = jwt_decode(token);
        setIsAdmin(decoded.isAdmin);
      } catch (error) {
        setIsAdmin(false);
      }
      
      setLoading(false);
    };

    checkUserRole();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (isAdmin) {
    return <Dashboard type="home" />;
  }

  return <Home />;
};

export default SmartHome;
