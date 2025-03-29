import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope } from "react-icons/fa";

function CheckYourEmail() {
  const navigate = useNavigate();

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center bg-light">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center p-4 bg-white rounded shadow-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FaEnvelope className="text-primary mb-3" size={50} />
        </motion.div>
        <h2 className="fw-bold">Check Your Email</h2>
        <p className="text-muted">We've sent a password reset link to your email. Please check your inbox and follow the instructions.</p>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>Back to Login</button>
      </motion.div>
    </div>
  );
}

export default CheckYourEmail;
