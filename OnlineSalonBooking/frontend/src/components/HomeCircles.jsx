import React from "react";
import CountUp from "react-countup";
import "../styles/homecircles.css";

const HomeCircles = () => {
  return (
    <section className="container circles">
      <div className="circle">
        <CountUp
          start={0}
          end={1000}
          delay={0}
          enableScrollSpy={true}
          scrollSpyDelay={500}
        >
          {({ countUpRef }) => (
            <div className="counter">
              <span ref={countUpRef} />+
            </div>
          )}
        </CountUp>
        <span className="circle-name">
          Happy
          <br />
          Clients
        </span>
      </div>
      <div className="circle">
        <CountUp
          start={0}
          end={150}
          delay={0}
          enableScrollSpy={true}
          scrollSpyDelay={500}
        >
          {({ countUpRef }) => (
            <div className="counter">
              <span ref={countUpRef} />+
            </div>
          )}
        </CountUp>
        <span className="circle-name">
          Professional
          <br />
          Stylists
        </span>
      </div>
      <div className="circle">
        <CountUp
          start={0}
          end={50}
          delay={0}
          enableScrollSpy={true}
          scrollSpyDelay={500}
        >
          {({ countUpRef }) => (
            <div className="counter">
              <span ref={countUpRef} />+
            </div>
          )}
        </CountUp>
        <span className="circle-name">
          Specialist
          <br />
          Stylists
        </span>
      </div>
    </section>
  );
};

export default HomeCircles;
