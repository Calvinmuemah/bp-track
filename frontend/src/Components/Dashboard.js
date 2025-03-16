import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Form, Spinner, Nav } from "react-bootstrap";
import axios from "axios";

function Dashboard() {
  const [email, setEmail] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) setEmail(userEmail);
  }, []);

  const sendReminderEmail = async () => {
    setLoadingEmail(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not authenticated. Please log in again.");
        return;
      }
      const response = await fetch("http://localhost:4000/reminder", {
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
      const response = await fetch("http://localhost:4000/api/chat", {
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
      <Row className="bg-primary text-white p-3 align-items-center">
        <Col><h4>BP Monitor</h4></Col>
        <Col className="text-end">
          <Button variant="danger" onClick={handleLogout} disabled={loadingLogout}>
            {loadingLogout ? <Spinner animation="border" size="sm" /> : "Logout"}
          </Button>
        </Col>
      </Row>

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
      </Nav>

      <Row className="flex-grow-1 mt-3">
        <Col md={4} className="d-flex flex-column">
          <Card className="bg-danger text-white">
            <Card.Body>
              <Card.Title>Email Reminder</Card.Title>
              <Card.Text>Your email: {email}</Card.Text>
              <Button variant="light" onClick={sendReminderEmail} disabled={loadingEmail}>
                {loadingEmail ? <Spinner animation="border" size="sm" /> : "Send Reminder Email"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8} className="d-flex flex-column">
          <Card className="bg-primary text-white flex-grow-1 d-flex flex-column">
            <Card.Body className="d-flex flex-column flex-grow-1">
              <Card.Title>Ask AI</Card.Title>
              <div className="chat-box flex-grow-1 overflow-auto bg-white p-3 rounded">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`d-flex ${msg.sender === "user" ? "justify-content-end" : "justify-content-start"} mb-2`}
                  >
                    <div
                      className={`p-2 rounded text-white ${msg.sender === "user" ? "bg-danger" : "bg-primary"}`}
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
