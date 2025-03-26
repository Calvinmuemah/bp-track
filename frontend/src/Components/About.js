import React from "react";

const About = () => {
  return (
    <section className="container my-5 py-5">
      <div className="row align-items-center">
        {/* Left Side - Image */}
        <div className="col-md-6 text-center">
          <img
            src="/IMG/LOGO.png" // Replace with actual image
            alt="Blood Pressure Monitoring"
            className="img-fluid rounded shadow-lg"
          />
        </div>

        {/* Right Side - Text */}
        <div className="col-md-6">
          <h2 className="text-primary fw-bold">About Us</h2>
          <p className="lead text-muted">
            Welcome to <strong>BP Tracker</strong>—your personal health companion for monitoring blood pressure effortlessly.
          </p>
          <p>
            Our AI-powered platform simplifies blood pressure tracking with real-time analytics, personalized insights, and smart alerts.
            Designed for both individuals and healthcare professionals, our system ensures you stay informed about your heart health.
          </p>
          <p>
            Our mission is to empower users with technology-driven health management solutions that improve well-being and quality of life.
          </p>
          <div className="d-flex gap-3 mt-4">
            <a href="/contact" className="btn btn-primary shadow-sm">Get in Touch</a>
            <a href="/explore" className="btn btn-outline-primary shadow-sm">Explore Features</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
