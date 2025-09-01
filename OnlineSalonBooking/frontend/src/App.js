import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Protected, Public, Admin } from "./middleware/route";
import React, { lazy, Suspense } from "react";
import Loading from "./components/Loading";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Appointments = lazy(() => import("./pages/Appointments"));
const Stylists = lazy(() => import("./pages/Stylists"));
const Profile = lazy(() => import("./pages/Profile"));
const Notifications = lazy(() => import("./pages/Notifications"));
const ApplyStylist = lazy(() => import("./pages/ApplyStylist"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Error = lazy(() => import("./pages/Error"));

function App() {
  return (
    <Router>
      <Toaster />
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <Public>
                <Login />
              </Public>
            }
          />
          <Route
            path="/register"
            element={
              <Public>
                <Register />
              </Public>
            }
          />

          {/* Unprotected Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/stylists" element={<Stylists />} />



          {/* Protected Routes */}
          <Route
            path="/appointments"
            element={
              <Protected>
                <Appointments />
              </Protected>
            }
          />
          <Route
            path="/notifications"
            element={
              <Protected>
                <Notifications />
              </Protected>
            }
          />
          <Route
              path="/applyforstylist"
            element={
              <Protected>
                <ApplyStylist />
              </Protected>
            }
          />
          <Route
            path="/profile"
            element={
              <Protected>
                <Profile />
              </Protected>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/dashboard"
            element={
              <Admin>
                <Navigate to="/dashboard/users" replace />
              </Admin>
            }
          />
          <Route
            path="/dashboard/users"
            element={
              <Admin>
                <Dashboard type="users" />
              </Admin>
            }
          />
          <Route
             path="/dashboard/stylists"
            element={
              <Admin>
               <Dashboard type="stylists" />
              </Admin>
            }
          />
          <Route
            path="/dashboard/appointments"
            element={
              <Admin>
                <Dashboard type="appointments" />
              </Admin>
            }
          />
          <Route
            path="/dashboard/applications"
            element={
              <Admin>
                <Dashboard type="applications" />
              </Admin>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <Admin>
                <Dashboard type="profile" />
              </Admin>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<Error />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
