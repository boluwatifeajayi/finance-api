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
import Insight from './pages/user/Insight';
import Article from './pages/user/Article';
import Welcome from './pages/user/Welcome';
import Contact from './pages/user/Contact';
import Help from './pages/user/Help';
import PrivacyPolicy from './pages/user/PrivacyPolicy';
import Update from './pages/user/Update';
import Setup from './pages/user/setUp';



function App() {
  return (
    <>
      <Router>
        <div>
          {/* <Header/> */}
          <Routes>
            <Route path="/" element={<Welcome/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/setup" element={<FinanceDetails/>} />
            <Route path="/home" element={<Home/>} />
            <Route path="/savings" element={<Savings/>} />
            <Route path="/budget" element={<Budget/>}/>
            <Route path="/account" element={<Account/>}/>
            <Route path="/insight" element={<Insight/>}/>
            <Route path="/article/:id" element={<Article/>}/>
            <Route path="/welcome" element={<Welcome/>}/>
            <Route path="/contact" element={<Contact/>}/>
            <Route path="/help" element={<Help/>}/>
            <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
            <Route path="/update" element={<Update/>}/>
            <Route path="/set" element={<Setup/>}/>
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
