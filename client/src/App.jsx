import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from './pages/user/Register';
import Login from './pages/user/Login';
import FinanceDetails from './pages/user/FinanceDetails';
import Home from './pages/user/Home';
import Savings from './pages/user/Savings';
import Budget from './pages/user/Budget';
import Account from './pages/user/Account';


function App() {
  return (
    <>
      <Router>
        <div>
          {/* <Header/> */}
          <Routes>
            <Route path="/" element={<Register/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/setup" element={<FinanceDetails/>} />
            <Route path="/home" element={<Home/>} />
            <Route path="/savings" element={<Savings/>} />
            <Route path="/budget" element={<Budget/>}/>
            <Route path="/account" element={<Account/>}/>
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
