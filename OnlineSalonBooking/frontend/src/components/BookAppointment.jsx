import React, { useState } from "react";
import "../styles/bookappointment.css";
import axios from "axios";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";

const BookAppointment = ({ setModalOpen, ele }) => {
  const [formDetails, setFormDetails] = useState({
    date: "",
    time: "",
  });

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
        return toast.error("Please select date and time");
      }

      // Check if date is in the future
      const selectedDate = new Date(formDetails.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
      
      if (selectedDate <= today) {
        return toast.error("Please select a future date");
      }

      await toast.promise(
        axios.post("/appointment/book",
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
          success: "Appointment booked successfully",
          error: "Unable to book appointment",
          loading: "Booking appointment...",
        }
      );
      setModalOpen(false);
    } catch (error) {
      toast.error("Error while booking");
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
            <input
              type="date"
              name="date"
              className="form-input"
              value={formDetails.date}
              onChange={inputChange}
              min={new Date().toISOString().split('T')[0]} // Disable past dates
            />
            <input
              type="time"
              name="time"
              className="form-input"
              value={formDetails.time}
              onChange={inputChange}
            />
            <button
              type="submit"
              className="btn form-btn"
              onClick={bookAppointment}
            >
              Book
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;