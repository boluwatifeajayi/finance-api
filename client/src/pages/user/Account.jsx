import React, { useState, useEffect } from 'react';
import { FaEdit, FaUser, FaCog, FaQuestionCircle, FaPhoneAlt, FaChevronRight } from 'react-icons/fa';
import BottomNavigation from '../../components/BottomNavigation';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getUserInfo, createIncome, createExpense, reset, getAllExpenses, getAllIncomes } from '../../features/user/userSlice';
import { toast } from 'react-toastify';

const Account = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, userDetails, incomes, expenses, isLoading, isError, isSuccess, message } = useSelector((state) => state.userauth);

  useEffect(() => {
    if (isError) {
      toast.error("we ran into a problem");
    }

    dispatch(getUserInfo());

    return () => {
      dispatch(reset());
    };
  }, []);


  return (
    <div className="min-h-screen pt-8 bg-blue-700">
      <div className="p-4">
        {/* <div className="flex mt-4 justify-end">
          <button className="text-white text-md">
            <FaEdit className="inline-block mr-1" />
            Edit Profile
          </button>
        </div> */}
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
              <div className="flex items-center">
                <FaUser className="text-gray-500" />
                <span className="ml-3">Account</span>
              </div>
              <FaChevronRight className="text-gray-400" />
            </li>
            <li className="flex items-center justify-between py-4 px-6">
              <div className="flex items-center">
                <FaCog className="text-gray-500" />
                <span className="ml-3">Settings</span>
              </div>
              <FaChevronRight className="text-gray-400" />
            </li>
            <li className="flex items-center justify-between py-4 px-6">
              <div className="flex items-center">
                <FaQuestionCircle className="text-gray-500" />
                <span className="ml-3">Help</span>
              </div>
              <FaChevronRight className="text-gray-400" />
            </li>
            <li className="flex items-center justify-between py-4 px-6">
              <div className="flex items-center">
                <FaPhoneAlt className="text-gray-500" />
                <span className="ml-3">Contact</span>
              </div>
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
