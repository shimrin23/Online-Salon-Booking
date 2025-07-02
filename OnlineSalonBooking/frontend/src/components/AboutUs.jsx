import React from "react";
import image from "../images/aboutimg.jpg"; // You can change the image to a salon-related one

const AboutUs = () => {
  return (
    <section className="container">
      <h2 className="page-heading about-heading">About Us</h2>
      <div className="about">
        <div className="hero-img">
          <img
            src={image}
            alt="Salon"
          />
        </div>
        <div className="hero-content">
          <p>
            Welcome to GlamourGlow, your go-to destination for premium salon services.
            Our professional stylists and beauticians are passionate about helping you
            look and feel your best. From haircuts and styling to facials and spa treatments,
            we offer a wide range of services to pamper you in a relaxing environment.
            Book your appointment today and experience the transformation!
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
