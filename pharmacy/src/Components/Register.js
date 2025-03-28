import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, Toaster } from "react-hot-toast";
import RegisterValidation from "./RegisterValidation";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [location, setLocation] = useState({
    coordinates: [34.75229, 0.28422],
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const notify = toast.loading("Signing Up...");

    const validationErrors = RegisterValidation(username, email, password, phone_number, location);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/api/reg/reg`, {
          username,
          email,
          password,
          phone_number,
          location,
        });

        toast.success("Signed up successfully!", { id: notify });
        alert("Signup successful! Please log in.");
        navigate("/");
      } catch (error) {
        console.error("Signup Error:", error.response?.data || error.message);
        toast.error("Signup failed. Please try again.", { id: notify });
      }
    } else {
      toast.error("Please fix the errors before submitting.", { id: notify });
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-primary text-white px-3">
      <Toaster />
      <div className="row justify-content-center w-100">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="bg-white text-dark p-4 p-md-5 rounded shadow-lg">
            <h2 className="fw-bold mb-4 text-center">Create an Account</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && <small className="text-danger">{errors.username}</small>}
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <small className="text-danger">{errors.email}</small>}
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <small className="text-danger">{errors.password}</small>}
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Enter phone number"
                  required
                  value={phone_number}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                {errors.phone_number && <small className="text-danger">{errors.phone_number}</small>}
              </div>

              <button type="submit" className="btn btn-primary w-100">Sign Up</button>

              <p className="mt-3 text-center">
                Already have an account?{" "}
                <Link to="/" className="text-primary fw-bold">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
