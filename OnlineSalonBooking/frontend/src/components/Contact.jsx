// components/Contact.jsx
import React, { useState } from "react";
import "../styles/contact.css";

const Contact = () => {
  const [formDetails, setFormDetails] = useState({
    name: "",
    email: "",
    message: "",
  });

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  return (
    <section className="contact-section flex-center" id="contact">
      <div className="contact-container flex-center">
        <h2 className="form-heading">Contact Us</h2>
        <form
          method="POST"
          action={`https://formspree.io/f/${process.env.REACT_FORMIK_SECRET}`}
          className="contact-form"
        >
          <input
            type="text"
            name="name"
            className="form-input"
            placeholder="Your Name"
            value={formDetails.name}
            onChange={inputChange}
          />
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="Your Email"
            value={formDetails.email}
            onChange={inputChange}
          />
          <textarea
            name="message"
            className="form-input"
            placeholder="How can we help you?"
            value={formDetails.message}
            onChange={inputChange}
            rows="8"
          />
          <button type="submit" className="btn form-btn">
            Send
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
