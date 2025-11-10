import React from "react";
import image from "../images/heroimg.jpg";
import "../styles/hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Elegance Meets <br />
          <span style={{ color: 'var(--accent-color)' }}>Excellence</span>
        </h1>
        <p>
          Discover the art of beauty at GlamourGlow. Our master stylists create 
          timeless looks that reflect your unique style. Experience luxury, 
          precision, and transformation in every visit.
        </p>
        <button className="btn" onClick={() => window.location.href = '/stylists'}>
          Book Your Session
        </button>
      </div>
      <div className="hero-img">
        <img
          src={image}
          alt="Luxury Salon Experience"
        />
      </div>
    </section>
  );
};

export default Hero;
