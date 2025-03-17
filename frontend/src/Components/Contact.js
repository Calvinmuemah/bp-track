import React, { useState } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");

    try {
      const res = await axios.post("https://bp-track-tof5.vercel.app/api/contact", formData);
      setResponseMessage(res.data.message);
      setFormData({ name: "", email: "", subject: "", message: "" }); // Clear form on success
    } catch (error) {
      setResponseMessage("Error sending message. Please try again.");
    }

    setLoading(false);
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Contact Us</h2>
      {responseMessage && <Alert variant="info">{responseMessage}</Alert>}

      <Form onSubmit={handleSubmit} className="shadow-lg p-4 rounded bg-light">
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Subject</Form.Label>
          <Form.Control type="text" name="subject" value={formData.subject} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Message</Form.Label>
          <Form.Control as="textarea" name="message" rows={4} value={formData.message} onChange={handleChange} required />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Send Message"}
        </Button>
      </Form>
    </Container>
  );
}

export default Contact;
