import React, { useState } from "react";
import "../styles/bookappointment.css";
import "../styles/register.css"; // Add this import to get the missing styles
import axios from "axios";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";

const BookAppointment = ({ setModalOpen, ele }) => {
  const [formDetails, setFormDetails] = useState({
    date: "",
    time: "",
  });
  const [loading, setLoading] = useState(false);

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const bookAppointment = async (e) => {
    e.preventDefault();
    
    try {
      // Validation - Check if date and time are selected
      if (!formDetails.date || !formDetails.time) {
        return toast.error("Please select both date and time for your appointment");
      }

      // Check if date is in the future
      const selectedDate = new Date(formDetails.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
      
      if (selectedDate <= today) {
        return toast.error("Please select a future date for your appointment");
      }

      // Validate time (between 9 AM and 8 PM)
      const [hours] = formDetails.time.split(':').map(Number);
      if (hours < 9 || hours >= 20) {
        return toast.error("Please select a time between 9:00 AM and 8:00 PM");
      }

      setLoading(true);
      await toast.promise(
        axios.post("/api/appointment/book",
          {
            stylistId: ele?.userId?._id,
            date: formDetails.date,
            time: formDetails.time,
            stylistName: `${ele?.userId?.firstname} ${ele?.userId?.lastname}`,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          success: "Your appointment has been booked successfully!",
          error: "Unable to book appointment. Please try again.",
          loading: "Booking your appointment...",
        }
      );
      setModalOpen(false);
    } catch (error) {
      toast.error("Error while booking. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal flex-center">
      <div className="modal__content">
        <h2 className="page-heading">Book Salon Appointment</h2>
        <IoMdClose
          onClick={() => setModalOpen(false)}
          className="close-btn"
        />
        <div className="register-container flex-center book">
          <form className="register-form">
            <div className="form-group">
              <label htmlFor="date">Select Date</label>
              <input
                type="date"
                id="date"
                name="date"
                className="form-input"
                value={formDetails.date}
                onChange={inputChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group">
              <label htmlFor="time">Select Time (9 AM - 8 PM)</label>
              <input
                type="time"
                id="time"
                name="time"
                className="form-input"
                value={formDetails.time}
                onChange={inputChange}
                min="09:00"
                max="20:00"
              />
            </div>
            {ele?.userId && (
              <p className="stylist-info">
                Booking with: {ele.userId.firstname} {ele.userId.lastname}
              </p>
            )}
            <button
              type="submit"
              className="btn form-btn"
              onClick={bookAppointment}
              disabled={loading}
            >
              {loading ? "Booking..." : "Book Appointment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;