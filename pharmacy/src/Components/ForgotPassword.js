import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    const notify = toast.loading("Sending reset link...");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        toast.success("Reset link sent! Check your email.", { id: notify });
        setTimeout(() => navigate("/login"), 3000); // Redirect to login page
      } else {
        toast.error("Failed to send reset link. Try again.", { id: notify });
      }
    } catch (error) {
      toast.error("Error sending reset link.", { id: notify });
      console.error("Error:", error);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column align-items-center justify-content-center bg-primary text-white">
      <Toaster />
      <h2 className="fw-bold mb-4">Reset Your Password</h2>
      <form
        onSubmit={handleForgotPassword}
        className="w-50 bg-white text-dark p-5 rounded shadow-lg"
      >
        <div className="mb-3">
          <label className="form-label">Enter Your Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter Your Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Send Reset Link
        </button>

        <p className="mt-3 text-center">
          Remember your password?{" "}
          <span
            className="text-primary fw-bold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;
