import React, { useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import RegisterValidation from "./RegisterValidation";
import "bootstrap/dist/css/bootstrap.min.css";

function Register() {
  // const [form, setForm] = useState({ name: "", email: "", password: "", phone_number: "", location: "" });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [location, setLocation] = useState({
    coordinates: [34.75229, 0.28422],
  });
  
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const form ={
    name,
    email,
    password,
    phone_number,
    location,
  }


  // const handleChange = (e) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };

  const handleSubmit = async (event) => {
      event.preventDefault();
      const notify = toast.loading("Signing Up...");
  
      const validationErrors = RegisterValidation(name, email, password, phone_number, location);
      setErrors(validationErrors);
  
      if (Object.keys(validationErrors).length === 0) {
        try {
          await axios.post("https://bp-track-tof5.vercel.app/register", form);
            
  
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
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: "350px" }}>
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input 
              type="text" 
              name="name" 
              placeholder="Enter your name" 
              className="form-control" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <small className="text-danger">{errors.name}</small>}
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              name="email" 
              placeholder="Enter your email"  
              className="form-control" 
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
              name="password" 
              placeholder="Enter your password" 
              className="form-control" 
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
              name="phone_number" 
              placeholder="Enter your Phone Number" 
              className="form-control" 
              required
              value={phone_number}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            {errors.phone_number && <small className="text-danger">{errors.phone_number}</small>}
            </div>
            {/* <div className="mb-3">
            <label className="form-label">Location</label>
            <input 
              type="text"
              name="location"  
              placeholder="Enter your Location" 
              onChange={handleChange} 
              className="form-control" 
              required
            />
          </div> */}
          <button type="submit" className="btn btn-primary w-100">Register</button>
          <div>
            <p>Already Have An Account... <Link to="/">Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
