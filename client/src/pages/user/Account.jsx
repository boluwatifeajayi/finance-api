import React, { useState, useEffect } from 'react';
import { FaEdit, FaUser, FaCog, FaQuestionCircle, FaPhoneAlt, FaChevronRight, FaBook, FaArrowLeft } from 'react-icons/fa';
import BottomNavigation from '../../components/BottomNavigation';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getUserInfo, createIncome, createExpense, reset, getAllExpenses, getAllIncomes, logout } from '../../features/user/userSlice';
import { toast } from 'react-toastify';

const Account = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, userDetails, incomes, expenses, isLoading, isError, isSuccess, message } = useSelector((state) => state.userauth);

  useEffect(() => {
    if (isError) {
      console.log("we ran into a problem");
    }

    dispatch(getUserInfo());

    return () => {
      dispatch(reset());
    };
  }, []);

  if(isLoading){
    return <div className="flex items-center justify-center h-screen bg-blue-700">
    <p className="text-white text-3xl font-bold">Loading PRIME...</p>
  </div>
  }



  return (
    <div className="min-h-screen pt-8 bg-blue-700">
      <div className="p-4">
        <div className="flex items-center mt-8">
          <div className="bg-gray-300 rounded-full p-2">
            <FaUser className="text-white text-3xl" />
          </div>
          <div className="ml-4">
            <p className="text-lg font-semibold text-white">{userDetails?.firstname} {userDetails?.lastname}</p>
            <p className="text-white opacity-75">{userDetails.email}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg mt-8">
          <ul className="divide-y divide-gray-200">
            <li className="flex items-center justify-between py-4 px-6">
              <Link to='/update' className="flex items-center">
                <FaUser className="text-gray-500" />
                <span className="ml-3">Account</span>
              </Link>
              <FaChevronRight className="text-gray-400" />
            </li>
            <li className="flex items-center justify-between py-4 px-6">
              <li className="flex items-center">
                <FaCog className="text-gray-500" />
                <span className="ml-3">Settings</span>
              </li>
              <FaChevronRight className="text-gray-400" />
            </li>
            <li className="flex items-center justify-between py-4 px-6">
              <Link to='/privacy-policy' className="flex items-center">
                <FaBook className="text-gray-500" />
                <span className="ml-3">Privacy Policy</span>
              </Link>
              <FaChevronRight className="text-gray-400" />
            </li>
            <li className="flex items-center justify-between py-4 px-6">
              <Link to='/help' className="flex items-center">
                <FaQuestionCircle className="text-gray-500" />
                <span className="ml-3">Help</span>
              </Link>
              <FaChevronRight className="text-gray-400" />
            </li>
            <li className="flex items-center justify-between py-4 px-6">
              <Link to='/contact' className="flex items-center">
                <FaPhoneAlt className="text-gray-500" />
                <span className="ml-3">Contact</span>
              </Link>
              <FaChevronRight className="text-gray-400" />
            </li>
            <li className="flex items-center justify-between py-4 px-6">
            <span onClick={() => { dispatch(logout()); navigate('/login'); }} className="flex items-center">
              <FaArrowLeft className="text-gray-500" />
              <span className="ml-3">Logout</span>
            </span>
              <FaChevronRight className="text-gray-400" />
            </li>
          </ul>
        </div>
      </div>
      <BottomNavigation/>
    </div>
  );
}

export default Account;
