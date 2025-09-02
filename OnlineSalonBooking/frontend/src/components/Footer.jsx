import React from "react";
import "../styles/footer.css";
import { FaFacebookF, FaYoutube, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { HashLink } from "react-router-hash-link";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div className="footer-main">
        <div className="footer-content">
          {/* Company Info Section */}
          <div className="footer-section company-info">
            <h3>GlamourGlow</h3>
            <p>
              Where beauty meets artistry. We create timeless looks that enhance 
              your natural beauty and boost your confidence.
            </p>
            <div className="social-links">
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" className="social-icon facebook">
                <FaFacebookF />
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="social-icon instagram">
                <FaInstagram />
              </a>
              <a href="https://www.youtube.com/" target="_blank" rel="noreferrer" className="social-icon youtube">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><NavLink to={"/"}>Home</NavLink></li>
              <li><NavLink to={"/stylists"}>Our Stylists</NavLink></li>
              <li><NavLink to={"/profile"}>My Profile</NavLink></li>
              <li><HashLink to={"/#about"}>About Us</HashLink></li>
            </ul>
          </div>

          {/* Services Section */}
          <div className="footer-section">
            <h4>Our Services</h4>
            <ul>
              <li>Hair Styling</li>
              <li>Hair Coloring</li>
              <li>Facial Treatments</li>
              <li>Manicure & Pedicure</li>
              <li>Bridal Makeup</li>
              <li>Spa Treatments</li>
            </ul>
          </div>

          {/* Contact Info Section */}
          <div className="footer-section contact-info">
            <h4>Contact Info</h4>
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <span>Ruhuna Engineering,Hapugala, Galle</span>
            </div>
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <span>+94768810026</span>
            </div>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <span>shimrinsiraj@gmail.com</span>
            </div>
            <div className="contact-item">
              <FaClock className="contact-icon" />
              <span>Mon-Sat: 9AM-8PM, Sun: 10AM-6PM</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>
            © {new Date().getFullYear()} SM.SHIMRIN. All rights reserved.
          </p>
          <p>
            Crafted with ❤️ by{" "}
            <a
              href="https://www.linkedin.com/in/smrn01223?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B82T%2F4L6fSImgvjCLXYHF9Q%3D%3D"
              target="_blank"
              rel="noreferrer"
            >
              SHIMRIN
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
