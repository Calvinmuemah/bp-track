import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/login/login`, form);
      localStorage.setItem("token", res.data.token);
      
      toast.success("Login successful!", { autoClose: 2000 });
      setTimeout(() => navigate("/dashboard"), 2000); // Delay navigation to show toast
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    }

    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: "350px" }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              name="email" 
              placeholder="Enter your email" 
              onChange={handleChange} 
              className="form-control" 
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              name="password" 
              placeholder="Enter your password" 
              onChange={handleChange} 
              className="form-control" 
              required
            />
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <button type="submit" className="btn btn-success w-100" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
          <div className="text-center mt-3">
            <Link to="/ForgotPassword" className="text-danger">Forgot Password?</Link>
          </div>
          <p className="text-center mt-2">
            Don't Have An Account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>

      {/* Toastify Notification Container */}
      <ToastContainer />
    </div>
  );
}

export default Login;
