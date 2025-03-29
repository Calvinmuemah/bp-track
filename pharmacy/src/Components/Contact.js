import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your message has been sent!");
    setFormData({ name: "", email: "", message: "" });
  };

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
            <a href="/about" className="nav-link text-dark mx-2">About</a>
            <a href="/community" className="nav-link text-dark mx-2">Community</a>
          </div>
        </div>
      </nav>

      {/* Contact Section */}
      <div className="container py-5">
        <h2 className="text-center fw-bold text-primary">📞 Contact Us</h2>
        <p className="text-center">Have a question? Reach out to us below.</p>

        <div className="row mt-4">
          {/* Contact Info */}
          <div className="col-md-5">
            <h4 className="text-primary">📍 Office Address</h4>
            <p>123 Health Street, Wellness City, WP 45678</p>
            <h4 className="text-primary">📧 Email</h4>
            <p>support@bptracker.com</p>
            <h4 className="text-primary">📞 Phone</h4>
            <p>+123 456 7890</p>

            <h4 className="text-primary">🔗 Follow Us</h4>
            <div>
              <a href="#" className="text-primary mx-2">Facebook</a>
              <a href="#" className="text-primary mx-2">Twitter</a>
              <a href="#" className="text-primary mx-2">Instagram</a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-md-7">
            <div className="card shadow-sm p-4">
              <h4 className="text-primary">Send Us a Message</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Your Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Your Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea 
                    className="form-control" 
                    name="message" 
                    rows="4" 
                    value={formData.message} 
                    onChange={handleChange} 
                    required 
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Contact;
