import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

export const Protected = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    // Redirect to home or login if no token found
    return <Navigate to="/" replace />;
  }
  return children;
};

export const Public = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    // If no token, show public route children
    return children;
  }
  // If logged in, redirect away from public routes (login/register)
  return <Navigate to="/" replace />;
};

export const Admin = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    // If no token, redirect away immediately
    return <Navigate to="/" replace />;
  }

  try {
    const user = jwtDecode(token);
    if (user.isAdmin) {
      return children;
    }
  } catch (error) {
    // Invalid token, redirect
    return <Navigate to="/" replace />;
  }

  // Not admin, redirect to home or unauthorized page
  return <Navigate to="/" replace />;
};
