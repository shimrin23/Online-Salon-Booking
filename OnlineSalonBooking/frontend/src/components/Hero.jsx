import React from "react";
import image from "../images/heroimg.jpg";
import "../styles/hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Look Your Best, <br />
          Feel Amazing
        </h1>
        <p>
          Experience top-notch salon services tailored just for you. Book your
          appointment today and step into style!
        </p>
      </div>
      <div className="hero-img">
        <img
          src={image}
          alt="Salon Hero"
        />
      </div>
    </section>
  );
};

export default Hero;
