import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, Toaster } from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [access_token, setAccess_token] = useState(localStorage.getItem("jwtToken"));

  const navigate = useNavigate();

  useEffect(() => {
    if (access_token) {
      window.location.href = "/dashboard";
    }
  }, [access_token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const notify = toast.loading("Logging in...");

    try {
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/login/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Invalid credentials", { id: notify });
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      localStorage.setItem("jwtToken", data.access_token);
      toast.success("Logged in successfully!", { id: notify });
      window.location.href = "/";
    } catch (error) {
      toast.error("Internal server error", { id: notify });
      console.error("Error:", error);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-primary text-white px-3">
      <Toaster />
      <div className="row justify-content-center w-100">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="bg-white text-dark p-4 p-md-5 rounded shadow-lg">
            <h2 className="fw-bold mb-4 text-center">Welcome Back!</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter Your Email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <p className="text-end">
                <button
                  type="button"
                  className="btn btn-link p-0 text-primary"
                  onClick={() => navigate("/ForgotPassword")}
                >
                  Forgot Password?
                </button>
              </p>

              <button type="submit" className="btn btn-primary w-100">Sign In</button>

              <p className="mt-3 text-center">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary fw-bold">
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
