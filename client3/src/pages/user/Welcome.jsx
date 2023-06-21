import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

function Welcome() {
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  const quotes = [
    "Wealth is not about having a lot of money; it's about having a lot of options.",
    "The more I learn, the more I realize how much I don't know.",
    "Invest in yourself. Your education, your health, your retirement. Invest in yourself.",
    "The best way to predict the future is to create it.",
    "The only way to do great work is to love what you do.",
  ];

  const randomQuotes = () => {
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
      if (timer === 5) {
        navigate('/register');
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  return (
    // <div>
    //   <h1>Welcome!</h1>
    //   <p>{randomQuotes()}</p>
    //   <p>Timer: {timer}</p>
    // </div>
  <div className="flex flex-col min-h-screen bg-blue-700 p-4 pb-40 md:p-8 items-center justify-center">
    <p className='text-5xl text-center text-white font-bold'>PR!ME</p>
    <p className='text-lg opacity-75 text-white text-center mt-6'>"Wealth is not about having a lot of money; it's about having a lot of options."</p>
    <div className="mt-6">
    <div className="spinner text-white text-lg">
        <FaSpinner/>
    </div>
  </div>
  </div>
  );
}

export default Welcome;