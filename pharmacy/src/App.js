import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login'
import Register from './Components/Register'
import Dashboard from './Components/Dashboard'
import ForgotPassword from './Components/ForgotPassword'
import ResetPassword from './Components/ResetLink'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
        <Routes>
        <Route path='/register' element={<Register />} ></Route>
          <Route path='/' element={<Login />}></Route>
          <Route path='/dashboard' element={<Dashboard />} ></Route>
          <Route path='/ForgotPassword' element={<ForgotPassword />} ></Route>
          <Route path='/reset-password/:token' element={<ResetPassword />} ></Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App