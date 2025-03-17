import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

function BPForm({ fetchHistory }) {
  const [form, setForm] = useState({ systolic: "", diastolic: "", pulse: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("User not authenticated. Please log in again.");
        setLoading(false);
        return;
      }
  
      // await axios.post("http://localhost:4000/api/bp/add", form, {
      //   headers: { Authorization: `Bearer ${token}` }, // ✅ Use Bearer token format
      // });
  
      const aiRes = await axios.post("http://localhost:4000/api/ai/analyze", form, {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Use Bearer token format
      });
  
      toast.info(aiRes.data.message);
      fetchHistory(); // Refresh history after adding record
    } catch (error) {
      console.error("Error:", error);
      // toast.error(error.response?.data?.message || "Failed to add record or get AI analysis");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand as={Link} to="/dashboard">BP Monitor</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/chart">BP Chart</Nav.Link>
            <Nav.Link as={Link} to="/about">About Us</Nav.Link>
            <Nav.Link as={Link} to="/history">BP History</Nav.Link>
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      
      <div className="card shadow-sm p-4 mt-4">
        <h4 className="text-center text-primary">Add Blood Pressure Record</h4>
        <form onSubmit={handleSubmit} className="mt-3">
          <div className="mb-3">
            <label className="form-label">Systolic</label>
            <input
              type="number"
              name="systolic"
              placeholder="Enter systolic value"
              value={form.systolic}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Diastolic</label>
            <input
              type="number"
              name="diastolic"
              placeholder="Enter diastolic value"
              value={form.diastolic}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Pulse</label>
            <input
              type="number"
              name="pulse"
              placeholder="Enter pulse rate"
              value={form.pulse}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Analyzing & Saving..." : "Analyze & Save"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BPForm;
