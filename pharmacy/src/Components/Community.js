import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Community() {
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
            <a href="#forum" className="nav-link text-dark mx-2">Forum</a>
            <a href="#stories" className="nav-link text-dark mx-2">Success Stories</a>
            <a href="#resources" className="nav-link text-dark mx-2">Resources</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container text-center py-5">
        <h2 className="fw-bold display-4 text-primary">Welcome to the BP Community</h2>
        <p className="lead">Connect, share, and learn about managing blood pressure together.</p>
      </div>

      {/* Sections */}
      <div className="container">
        {/* Discussion Forum */}
        <section id="forum" className="py-5">
          <h3 className="text-primary">💬 Discussion Forum</h3>
          <p>Join conversations about BP tracking, health tips, and more.</p>
          <button className="btn btn-primary">Join the Discussion</button>
        </section>

        {/* Success Stories */}
        <section id="stories" className="py-5 bg-white">
          <h3 className="text-primary">🌟 Success Stories</h3>
          <p>Read inspiring stories from users who improved their BP health.</p>
          <button className="btn btn-outline-primary">Read Stories</button>
        </section>

        {/* Resources */}
        <section id="resources" className="py-5">
          <h3 className="text-primary">📚 Tips & Resources</h3>
          <p>Find articles and guides to help you stay healthy.</p>
          <button className="btn btn-primary">Explore Resources</button>
        </section>
      </div>
    </div>
  );
}

export default Community;
