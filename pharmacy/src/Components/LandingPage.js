import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-primary min-vh-100 text-white">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white px-4 shadow-sm">
        <div className="container-fluid">
          {/* BP Tracker - Pushed to the Far Left */}
          <a className="navbar-brand fw-bold text-dark" href="login">BP Tracker</a>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="navbar-toggler border-0" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar links pushed to the far right */}
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <a className="navbar-brand fw-bold text-primary" href="/login">BP Tracker</a>
        <div className="ms-auto d-flex align-items-center">
          <a href="/about" className="nav-link text-dark mx-3">About</a>
          <a href="/community" className="nav-link text-dark mx-3">Community</a>
          <a href="/contact" className="nav-link text-dark mx-3">Contact</a>
          <button className="btn btn-primary ms-3" onClick={() => navigate("/login")}>Get Started</button>
        </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between min-vh-100 px-4">
        {/* Left Content - Aligned Left */}
        <div className="col-md-6 col-12 text-md-start text-center">
          <h2 className="fw-bold display-4">Track Your Blood Pressure Easily</h2>
          <p className="lead">Monitor and manage your BP with our smart tracking system.</p>
          <button className="btn btn-light btn-lg mt-3" onClick={() => navigate("/login")}>Get Started</button>
        </div>

        {/* Right Image - Aligned Right */}
        <div className="col-md-6 col-12 text-md-end text-center mt-4 mt-md-0">
          <img src="/bp-tracking-illustration.png" alt="BP Tracking" className="img-fluid" style={{ maxWidth: "450px" }} />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
