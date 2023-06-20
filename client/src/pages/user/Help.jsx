import {React, useEffect, useState} from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import BottomNavigation from "../../components/BottomNavigation";
import { GetSingleVisual, reset } from '../../features/visual/visualSlice';
import moment from 'moment';


const Help = () => {

  
  

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
        Get Help On PR!ME
      </h1>
      <p className="content mb-2 text-gray-700">
      

How to Create an Account

To create an account, you will need to provide your name, email address, and password. You will also need to provide a phone number and a financial institution. Once you have created an account, you will be able to log in and start using the app.

How to Track Your Expenses

To track your expenses, you can add transactions to the app. Transactions can be for anything, such as groceries, gas, or rent. The app will keep track of your spending and show you how much you are spending in each category.

How to Set Financial Goals

To set financial goals, you can use the app's goal-setting feature. This feature allows you to set a goal, such as saving for a down payment on a house, and track your progress towards that goal. The app will show you how much you need to save each month to reach your goal.

How to Get Help

If you need help with the app, you can contact customer support. Customer support is available 24/7 and can help you with anything, from setting up your account to troubleshooting problems.
      </p>
      {/* <p className="date text-gray-500">
        {timeDiff} by <soan className="text-blue-900 font-bold">PR!ME Admin</soan>
      </p> */}

      <BottomNavigation/>
    </div>
  );
};


 

export default Help;
