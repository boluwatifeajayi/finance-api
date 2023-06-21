import {React, useEffect, useState} from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import BottomNavigation from "../../components/BottomNavigation";
import { GetSingleVisual, reset } from '../../features/visual/visualSlice';
import moment from 'moment';


const Contact = () => {

  
  

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
        Contact Us
      </h1>
      <p className="content mb-2 text-gray-700">
      

      We want to hear from you! If you have any questions or feedback, please contact us using the following information:<br/>

            Email: [email address] <br/>
            Phone: [phone number]<br/>
            Website: [website address]<br/>
            Mailing Address:<br/>
            [App Developer Name]<br/>
            [App Developer Address]<br/>
            We also have a live chat feature on our website that you can use to get in touch with us. We are available 24/7 to answer your questions.

            Social Media<br/>

            You can also find us on social media:<br/>

            Facebook: [Facebook page URL]<br/>
            Twitter: [Twitter handle]<br/>
            Instagram: [Instagram handle]<br/>
            We look forward to hearing from you!
      </p>
      {/* <p className="date text-gray-500">
        {timeDiff} by <soan className="text-blue-900 font-bold">PR!ME Admin</soan>
      </p> */}

      <BottomNavigation/>
    </div>
  );
};


 

export default Contact;
