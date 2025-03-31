import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Form, Spinner, Nav } from "react-bootstrap";
import { GearFill } from "react-bootstrap-icons"; // ✅ Import settings icon
import axios from "axios";
import { Link } from "react-router-dom";

function Dashboard() {
  const [email, setEmail] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [nurses, setNurses] = useState([]);
  const [loadingNurses, setLoadingNurses] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  


  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) setEmail(userEmail);
    getUserLocation();
    // fetchNurses();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(locationData);
          await fetchNurses(locationData); // Fetch nurses after getting location
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    }
  };

  const fetchNurses = async () => {
    setLoadingNurses(true);
  
    if (!userLocation) {
      console.error("User location is not available yet.");
      setLoadingNurses(false);
      return;
    }
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/api/nearby-nurses/nearby-nurses`, {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      });
  
      setNurses(response.data); // Update state with fetched nurses
    } catch (error) {
      console.error("Error fetching nearby nurses:", error);
    }
  
    setLoadingNurses(false);
  };
  


  const sendReminderEmail = async () => {
    setLoadingEmail(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not authenticated. Please log in again.");
        return;
      }
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/reminder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      alert(response.ok ? "Reminder email sent successfully!" : `Error: ${data.error}`);
    } catch (error) {
      console.error("Error sending reminder:", error);
      alert("An error occurred while sending the reminder.");
    }
    setLoadingEmail(false);
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;
    setChatMessages([...chatMessages, { sender: "user", text: userMessage }]);
    setLoadingAI(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/chat/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: "ai", text: data.response || "I couldn't process that." },
      ]);
    } catch (error) {
      console.error("AI Request Error:", error);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: "ai", text: "Failed to connect to AI service." },
      ]);
    }
    setLoadingAI(false);
    setUserMessage("");
  };

  const handleLogout = () => {
    setLoadingLogout(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      window.location.href = "/";
    }, 2000);
  };

  return (
    <Container fluid className="vh-100 d-flex flex-column">
      {/* ✅ Navbar Section */}
      <Row className="bg-primary text-white p-3 align-items-center">
        <Col><h4>BP Monitor</h4></Col>
        <Col className="text-end">
          {/* ✅ Logout Button */}
          <Button variant="danger" onClick={handleLogout} disabled={loadingLogout} className="me-2">
            {loadingLogout ? <Spinner animation="border" size="sm" /> : "Logout"}
          </Button>

          {/* ✅ Settings Icon Button (Right after Logout) */}
          <Link to="/settings">
            <Button variant="light">
              <GearFill size={20} /> {/* ⚙️ Settings Icon */}
            </Button>
          </Link>
        </Col>
      </Row>

      {/* ✅ Navigation */}
      <Nav className="bg-light p-2">
        <Nav.Item>
          <Nav.Link href="/chart">BP Chart</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/history">BP History</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/form">BP Form</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/about">About Us</Nav.Link>
        </Nav.Item>
      </Nav>

      {/* ✅ Main Content */}
      <Row className="flex-grow-1 mt-3">
        {/* ✅ Email Reminder Section */}
        <Col md={4} className="d-flex flex-column">
          <Card className="bg-primary text-white">
            <Card.Body>
              <Card.Title>Email Reminder</Card.Title>
              <Card.Text>Your email: {email}</Card.Text>
              <Button variant="light" onClick={sendReminderEmail} disabled={loadingEmail}>
                {loadingEmail ? <Spinner animation="border" size="sm" /> : "Send Reminder Email"}
              </Button>
            </Card.Body>
          </Card>

          <Card className="mt-3">
            <Card.Body>
              <Card.Title>Available Nurses</Card.Title>
              {loadingNurses ? <Spinner animation="border" size="sm" /> : (
                nurses.length > 0 ? nurses.map(nurse => (
                  <Button key={nurse.id} className="m-1">{nurse.name}</Button>
                )) : <p>No nurses available nearby.</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* ✅ AI Chat Section */}
        <Col md={8} className="d-flex flex-column">
          <Card className="bg-primary text-white flex-grow-1 d-flex flex-column">
            <Card.Body className="d-flex flex-column flex-grow-1">
              <Card.Title>Ask AI</Card.Title>
              <div className="chat-box flex-grow-1 overflow-auto bg-primary p-3 rounded">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`d-flex ${msg.sender === "user" ? "justify-content-end" : "justify-content-start"} mb-2`}
                  >
                    <div
                      className={`p-2 rounded text-black ${msg.sender === "user" ? "bg-white" : "bg-white"}`}
                      style={{ maxWidth: "70%" }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loadingAI && (
                  <div className="d-flex justify-content-start mb-2">
                    <Spinner animation="border" size="sm" className="text-light" />
                  </div>
                )}
              </div>
              <Form.Control
                as="textarea"
                rows={2}
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Ask AI..."
                className="mt-3"
                disabled={loadingAI}
              />
              <Button className="mt-2 w-100 bg-danger" onClick={handleSendMessage} disabled={loadingAI}>
                {loadingAI ? <Spinner animation="border" size="sm" /> : "Ask AI"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
