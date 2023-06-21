import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserInfo } from '../../features/user/userSlice';
import { useNavigate } from 'react-router';
import BottomNavigation from '../../components/BottomNavigation';
import { Link } from 'react-router-dom';


const UserProfile = () => {
  const user = useSelector((state) => state.userauth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState(user.firstname);
  const [lastname, setLastname] = useState(user.lastname);
//   const [age, setAge] = useState(user.age);

  const handleFirstnameChange = (event) => {
    setFirstname(event.target.value);
  };

  const handleLastnameChange = (event) => {
    setLastname(event.target.value);
  };

  

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(
      updateUserInfo({
        firstname,
        lastname,
        // age,
      })
    );
    alert('Profile updated successfully!');
    // Update the state with the latest information from the database
    setFirstname(user.firstname);
    setLastname(user.lastname);
    // setAge(user.age);
    navigate('/user/dashboard')
  };

  return (
    <div>
      
      {/* User Profile */}
      <div className='p-8 w-full mt-6'>
      <Link to='/account'>
     <button
        className="back-button mt-2 mb-3 p-6 bg-blue-900 rounded-full"
        // onClick={onBack}
        type="button"
      >
        ← Back
      </button>  
     </Link>
      <div className="bg-white p-1">
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="firstname" className="block text-gray-700 font-bold mb-2">
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={firstname}
              onChange={handleFirstnameChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastname" className="block text-gray-700 font-bold mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={lastname}
              onChange={handleLastnameChange}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Update
          </button>
        </form>
      </div>
      </div>
     <BottomNavigation/>
    </div>
  );
};

export default UserProfile;
