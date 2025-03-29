import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Import Bootstrap JS

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-primary min-vh-100 text-white">
   
      <nav className="navbar navbar-expand-lg bg-primary
       px-4 shadow-sm">
        <div className="container-fluid">
          
          <a className="navbar-brand fw-bold text-dark" href="/">BP Tracker</a>

         
          <button
            className="navbar-toggler border-0 shadow-none" // Remove borders and focus outline
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav d-flex align-items-center">
              <li className="nav-item">
                <a href="/about" className="nav-link text-dark mx-2">About</a>
              </li>
              <li className="nav-item">
                <a href="/community" className="nav-link text-dark mx-2">Community</a>
              </li>
              <li className="nav-item">
                <a href="/contact" className="nav-link text-dark mx-2">Contact</a>
              </li>
              <li className="nav-item">
                <button 
                  className="btn btn-outline-white ms-3 border-2"
                  onClick={() => navigate("/login")}
                  style={{ background: "white" }} // Ensure white background
                >
                  Get Started
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between min-vh-100 px-4">
        {/* Left Content */}
        <div className="col-md-6 col-12 text-md-start text-center">
          <h2 className="fw-bold display-4">Track Your Blood Pressure Easily</h2>
          <p className="lead">Monitor and manage your BP with our smart tracking system.</p>
          <button className="btn btn-light btn-lg mt-3" onClick={() => navigate("/signup")}>Get Started</button>
        </div>

        {/* Right Image */}
        <div className="col-md-6 col-12 text-md-end text-center mt-4 mt-md-0">
          <img src="/bp-tracking-illustration.png" alt="BP Tracking" className="img-fluid" style={{ maxWidth: "450px" }} />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
