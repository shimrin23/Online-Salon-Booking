import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const auth = useAuth();
  const navigate = useNavigate();

  // If user is not logged in, redirect to login page
  React.useEffect(() => {
    if (!auth.user) {
      navigate("/");
    }
  }, [auth.user, navigate]);

  if (!auth.user) {
    return null; // or a loading spinner while redirecting
  }

  return (
    <div>
      <h1>Welcome, {auth.user.email}!</h1>
      <button
        onClick={() => {
          auth.logout();
          navigate("/");
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
