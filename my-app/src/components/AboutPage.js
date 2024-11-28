// jsx
import React from 'react';
// import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <section className="hero">
        <h1>About Our Company</h1>
        <p>Crafting exquisite jewelry since 1990.</p>
      </section>
      <section className="mission">
        <h2>Our Mission</h2>
        <p>
          To provide the finest jewelry with exceptional customer service, blending timeless
          craftsmanship with modern designs.
        </p>
      </section>
      <section className="team">
        <h2>Meet the Team</h2>
        {/* Add team member profiles here */}
      </section>
    </div>
  );
};

export default AboutPage;