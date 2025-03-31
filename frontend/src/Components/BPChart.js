import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ Import toast for better alerts

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function BPChart() {
  const [bpData, setBpData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBPData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("User not authenticated. Please log in again.");
          return;
        }

        const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/api/history/history`, {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Correct Bearer token format
        });

        if (res.data.length === 0) {
          toast.info("No BP records found.");
        }

        // ✅ Ensure correct data format for Chart.js
        const formattedData = res.data.map(bp => ({
          date: new Date(bp.createdAt).toLocaleDateString(),
          systolic: bp.systolic,
          diastolic: bp.diastolic,
        }));

        setBpData(formattedData);
      } catch (error) {
        console.error("Error fetching BP history:", error);
        setError(error.response?.data?.message || "Failed to fetch BP history");
        toast.error("Failed to fetch BP data");
      } finally {
        setLoading(false); // ✅ Stop loading after request
      }
    };

    fetchBPData();
  }, []);

  if (loading) return <div className="alert alert-info text-center">Loading chart...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  // ✅ Handle empty state gracefully
  if (bpData.length === 0) {
    return <div className="alert alert-warning text-center">No blood pressure data available.</div>;
  }

  const chartData = {
    labels: bpData.map((bp) => bp.date),
    datasets: [
      {
        label: "Systolic",
        data: bpData.map((bp) => bp.systolic),
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: "red",
      },
      {
        label: "Diastolic",
        data: bpData.map((bp) => bp.diastolic),
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: "blue",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      title: { display: true, text: "Blood Pressure Trends" },
    },
    scales: {
      x: { title: { display: true, text: "Date" } },
      y: { title: { display: true, text: "BP Reading (mmHg)" } },
    },
  };

  return (
    <div>
      <Navbar bg="primary" variant="dark" expand="lg">
        <Navbar.Brand as={Link} to="/dashboard">BP Monitor</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/form">BP Form</Nav.Link>
            <Nav.Link as={Link} to="/history">BP History</Nav.Link>
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/about">About Us </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="container mt-4">
        <div className="card shadow-lg">
          <div className="card-body">
            <h4 className="card-title text-center">Blood Pressure Trends</h4>
            <div className="chart-container p-3">
              <Line data={chartData} options={options} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BPChart;
