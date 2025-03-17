import React, { useEffect, useState } from "react";
import axios from "axios";
import GeneratePDF from "./GeneratePDF";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function BPHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("User not authenticated. Please log in again.");
          return;
        }
  
        const res = await axios.get("https://bp-track-tof5.vercel.app/api/bp/history", {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Ensure Bearer token format
        });
  
        setHistory(res.data);
      } catch (error) {
        console.error("Error fetching history:", error);
        alert(error.response?.data?.message || "Failed to fetch history");
      }
    };
  
    fetchHistory();
  }, []);
  

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand as={Link} to="/dashboard">BP Monitor</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/chart">BP Chart</Nav.Link>
            <Nav.Link as={Link} to="/form">BP Form</Nav.Link>
            <Nav.Link as={Link} to="/about">About Us</Nav.Link>
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      
      <div className="container mt-5">
        <div className="card shadow p-4">
          <h2 className="text-center mb-4">Blood Pressure History</h2>

          <div className="table-responsive">
            <table className="table table-bordered table-hover text-center">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Systolic</th>
                  <th>Diastolic</th>
                  <th>Pulse</th>
                  <th>Date</th>
                  <th>Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 ? (
                  history.map((bp, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{bp.systolic}</td>
                      <td>{bp.diastolic}</td>
                      <td>{bp.pulse}</td>
                      <td>{new Date(bp.createdAt).toLocaleDateString()}</td>
                      <td>{bp.recommendation || "No recommendation"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-muted">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-end mt-3">
            <GeneratePDF bpHistory={history} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BPHistory;
