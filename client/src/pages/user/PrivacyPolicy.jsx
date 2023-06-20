import {React, useEffect, useState} from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import BottomNavigation from "../../components/BottomNavigation";
import { GetSingleVisual, reset } from '../../features/visual/visualSlice';
import moment from 'moment';


const PrivacyPolicy = () => {

  
  

  return (
    <div className="article">
     
     <Link to='/account'>
     <button
        className="back-button mt-2 p-6 bg-blue-900 rounded-full"
        // onClick={onBack}
        type="button"
      >
        ← Back
      </button>  
     </Link>
        
      <h1 className="title mt-6 mb-2 text-3xl font-bold tracking-tight text-blue-900">
        Privacy Policy
      </h1>
      <p className="content mb-2 text-gray-700">
      <p>
        This privacy policy describes how we collect, use, and share your
        information when you use our app.
      </p>
      <p>
        We collect your personal information when you create an account,
        use our app, or interact with our website. This information may
        include your name, email address, phone number, and financial
        information.
      </p>
      <p>
        We use your personal information to provide you with the services
        you request, to improve our app, and to contact you about our
        products and services. We may also share your personal information
        with our partners who help us provide our services.
      </p>
      <p>
        You have the right to access, correct, or delete your personal
        information. You also have the right to opt out of our marketing
        communications.
      </p>
      <p>
        For more information about our privacy practices, please see our
        full privacy policy.
      </p>
      </p>
      {/* <p className="date text-gray-500">
        {timeDiff} by <soan className="text-blue-900 font-bold">PR!ME Admin</soan>
      </p> */}

      <BottomNavigation/>
    </div>
  );
};


 

export default PrivacyPolicy;
