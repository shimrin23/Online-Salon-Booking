import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const auth = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!auth.user) navigate("/");
  }, [auth.user, navigate]);

  // Profile info (expand later with backend data)
  const [profile, setProfile] = useState({
    email: auth.user?.email || "",
    name: "",
    phone: "",
  });

  // Booking list (static to start)
  const [bookings, setBookings] = useState([
    { id: 1, client: "Alice", date: "2025-07-01", service: "Haircut" },
    { id: 2, client: "Bob", date: "2025-07-03", service: "Manicure" },
  ]);

  // New booking form state
  const [newBooking, setNewBooking] = useState({
    client: "",
    date: "",
    service: "",
  });

  // Handle profile changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle new booking input changes
  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setNewBooking((prev) => ({ ...prev, [name]: value }));
  };

  // Submit new booking
  const handleAddBooking = (e) => {
    e.preventDefault();
    if (!newBooking.client || !newBooking.date || !newBooking.service) {
      alert("Please fill all booking fields");
      return;
    }
    const newId = bookings.length + 1;
    setBookings([...bookings, { id: newId, ...newBooking }]);
    setNewBooking({ client: "", date: "", service: "" });
  };

  if (!auth.user) return null; // wait while redirecting

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Welcome, {auth.user.email}!</h1>
      <p>{new Date().toLocaleString()}</p>

      <section style={{ marginTop: 30 }}>
        <h2>Profile</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Profile saved (not really, add backend later)");
          }}
        >
          <label>
            Email (read-only):
            <input type="email" value={profile.email} readOnly />
          </label>
          <br />
          <label>
            Name:
            <input
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              placeholder="Your name"
            />
          </label>
          <br />
          <label>
            Phone:
            <input
              name="phone"
              value={profile.phone}
              onChange={handleProfileChange}
              placeholder="Your phone"
            />
          </label>
          <br />
          <button type="submit" style={{ marginTop: 10 }}>
            Save Profile
          </button>
        </form>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Bookings</h2>
        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <ul>
            {bookings.map(({ id, client, date, service }) => (
              <li key={id}>
                {client} - {service} on {date}
              </li>
            ))}
          </ul>
        )}

        <h3>Add New Booking</h3>
        <form onSubmit={handleAddBooking}>
          <input
            name="client"
            value={newBooking.client}
            onChange={handleBookingChange}
            placeholder="Client Name"
          />
          <input
            name="date"
            type="date"
            value={newBooking.date}
            onChange={handleBookingChange}
          />
          <input
            name="service"
            value={newBooking.service}
            onChange={handleBookingChange}
            placeholder="Service"
          />
          <button type="submit" style={{ marginLeft: 10 }}>
            Add Booking
          </button>
        </form>
      </section>

      <section style={{ marginTop: 40 }}>
        <button
          onClick={() => {
            auth.logout();
            navigate("/");
          }}
          style={{ backgroundColor: "red", color: "white", padding: "10px 20px" }}
        >
          Logout
        </button>
      </section>
    </div>
  );
}

export default Dashboard;
