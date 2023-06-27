import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savingsInclined, feedingInclined, getUserInfo, reset } from '../../features/user/userSlice';
import { toast } from 'react-toastify';
import piggy from '../../media/Illustrations.png';

// Handle user's inclination selection
const handleInclinationSelection = (inclination, dispatch, navigate) => {
  if (inclination === 'savings') {
    dispatch(savingsInclined())
      .then(() => {
        navigate('/home');
      })
      .catch((error) => {
        console.log("Error:", error);
        toast.error("An error occurred while setting up savings inclined.");
      });
  } else if (inclination === 'feeding') {
    dispatch(feedingInclined())
      .then(() => {
        navigate('/home');
      })
      .catch((error) => {
        console.log("Error:", error);
        toast.error("An error occurred while setting up feeding inclined.");
      });
  }
};

function Setup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Access relevant state variables from the Redux store using useSelector
  const { userDetails, isError } = useSelector((state) => state.userauth);

  useEffect(() => {
    // Check if there is an error in retrieving user details
    if (isError) {
      console.log("We ran into a problem");
      // Handle the error or display an error message
      toast.error("An error occurred while fetching user details.");
    }

    // Dispatch the action to get user info
    dispatch(getUserInfo());

    // Cleanup function to reset the Redux state when the component is unmounted
    return () => {
      dispatch(reset());
    };
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  return (
    <div className="flex items-center justify-center h-screen bg-blue-700">
    <div className="flex flex-col items-center p-6 justify-center">
      <img src={piggy} className="w-40 h-40 mb-4" alt="Piggy Bank" />
      <p className="text-white text-xl font-bold text-center mb-6">What are you more inclined to?</p>
      <div className="flex justify-center space-x-2">
        <button
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
          onClick={() => handleInclinationSelection('savings', dispatch, navigate)}
        >
          Savings
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
          onClick={() => handleInclinationSelection('feeding', dispatch, navigate)}
        >
          Feeding
        </button>
      </div>
    </div>
  </div>
  
  );
}

export default Setup;
