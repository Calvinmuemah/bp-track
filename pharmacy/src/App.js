import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login'
import Register from './Components/Register'
import Dashboard from './Components/Dashboard'
import ForgotPassword from './Components/ForgotPassword'
import ResetPassword from './Components/ResetLink'
import CheckYourEmail from './Components/CheckYourEmail'
import LandingPage from './Components/LandingPage'
import Contact from './Components/Contact'
import About from './Components/About'
import Community from './Components/Community'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
        <Routes>
        <Route path='/register' element={<Register />} ></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/dashboard' element={<Dashboard />} ></Route>
          <Route path='/ForgotPassword' element={<ForgotPassword />} ></Route>
          <Route path='/reset-password/:token' element={<ResetPassword />} ></Route>
          <Route path='/CheckYourEmail' element={<CheckYourEmail />} ></Route>
          <Route path='/' element={<LandingPage />} ></Route>
          <Route path='/about' element={<About />} ></Route>
          <Route path='/contact' element={<Contact />} ></Route>
          <Route path='/community' element={<Community />} ></Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App


