import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function About() {
  return (
    <div className="bg-light min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white px-4 shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold text-primary" href="#">BP Tracker</a>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <a href="/" className="nav-link text-dark mx-2">Home</a>
            <a href="#how-it-works" className="nav-link text-dark mx-2">How It Works</a>
            <a href="#mission" className="nav-link text-dark mx-2">Mission</a>
            <a href="#contact" className="nav-link text-dark mx-2">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container text-center py-5">
        <h2 className="fw-bold display-4 text-primary">About BP Tracker</h2>
        <p className="lead">Helping you take control of your health with smart blood pressure tracking.</p>
      </div>

      {/* About Sections */}
      <div className="container">
        {/* How It Works */}
        <section id="how-it-works" className="py-5">
          <h3 className="text-primary">📊 How It Works</h3>
          <p>Track your blood pressure with real-time updates and historical insights.</p>
        </section>

        {/* Mission */}
        <section id="mission" className="py-5 bg-white">
          <h3 className="text-primary">🎯 Our Mission</h3>
          <p>Our mission is to empower individuals with easy-to-use BP tracking tools for better health.</p>
        </section>

        {/* Why Choose Us */}
        <section id="why-us" className="py-5">
          <h3 className="text-primary">✅ Why Choose BP Tracker?</h3>
          <ul>
            <li>Easy-to-use platform</li>
            <li>Real-time blood pressure tracking</li>
            <li>Health insights & recommendations</li>
            <li>Data privacy & security</li>
          </ul>
        </section>

        {/* Contact */}
        <section id="contact" className="py-5 bg-white">
          <h3 className="text-primary">📞 Contact Us</h3>
          <p>Email: support@bptracker.com</p>
        </section>
      </div>
    </div>
  );
}

export default About;
