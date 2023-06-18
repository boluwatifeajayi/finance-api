import React from 'react';
import { FaHome, FaMoneyBillAlt, FaPiggyBank, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BottomNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex justify-between rounded-t-lg">
      <Link to="/home" className="flex flex-col items-center text-gray-600">
        <FaHome className="text-xl" />
        <span className="text-xs mt-1">Home</span>
      </Link>
      <Link to="/budget" className="flex flex-col items-center text-gray-600">
        <FaMoneyBillAlt className="text-xl" />
        <span className="text-xs mt-1">Budget</span>
      </Link>
      <Link to="/savings" className="flex flex-col items-center text-gray-600">
        <FaPiggyBank className="text-xl" />
        <span className="text-xs mt-1">Savings</span>
      </Link>
      <Link to="/account" className="flex flex-col items-center text-gray-600">
        <FaUser className="text-xl" />
        <span className="text-xs mt-1">Accounts</span>
      </Link>
    </nav>
  );
}

export default BottomNavigation;
