import React from "react";
import image from "../images/aboutimg.jpg";

const AboutUs = () => {
  return (
    <section className="container">
      <h2 className="page-heading about-heading">Our Story</h2>
      <div className="about">
        <div className="hero-img">
          <img
            src={image}
            alt="GlamourGlow Salon"
          />
        </div>
        <div className="hero-content">
          <h3 style={{ 
            fontSize: '2rem', 
            marginBottom: '1.5rem', 
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-heading)'
          }}>
            Crafting Beauty Since 2010
          </h3>
          <p>
            At GlamourGlow, we believe that beauty is an art form that should be 
            accessible to everyone. Our journey began with a simple vision: to create 
            a sanctuary where clients can escape the ordinary and embrace the extraordinary.
          </p>
          <p>
            Our team of certified professionals combines traditional techniques with 
            cutting-edge trends, ensuring every client receives personalized care that 
            enhances their natural beauty. From precision haircuts to rejuvenating spa 
            treatments, we're committed to delivering excellence in every detail.
          </p>
          <p>
            Step into our world of luxury and let us transform not just your appearance, 
            but your entire experience of self-care and confidence.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
