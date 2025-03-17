import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Dashboard from "./Components/Dashboard";
import GeneratePDF from "./Components/GeneratePDF";
import BPChart from "./Components/BPChart";
import BPForm from "./Components/BPForm";
import BPHistory from "./Components/BPHistory";
import About from "./Components/About";
import Settings from "./Components/Settings";
import Contact from "./Components/Contact";
import Explore from "./Components/Explore";


function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/form" element={<BPForm />} />
        <Route path="/chart" element={<BPChart />} />
        <Route path="/pdf" element={<GeneratePDF />} />
        <Route path="/history" element={<BPHistory />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
    </Router>
  );
}


export default App;