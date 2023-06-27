import {React, useEffect, useState} from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import BottomNavigation from "../../components/BottomNavigation";
import { GetSingleVisual, reset } from '../../features/visual/visualSlice';
import moment from 'moment';


const Article = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { id } = useParams(); 

    const {singleVisual, isLoading, isError, isSuccess, message} = useSelector((state) => state.visual)

    const { title, content, createdAt, _id } = singleVisual

    useEffect(() => {
    
        dispatch(GetSingleVisual(id));
      
        return () => {
          dispatch(reset());
        };
      }, [dispatch, GetSingleVisual, id]);
  
      useEffect(() => {
        if (isError) {
          console.log(message);
        }
      }, [isError, message]);
  
  
    const timeDiff = moment(createdAt).fromNow();

    if(isLoading){
      return <div className="flex items-center justify-center h-screen bg-blue-700">
      <p className="text-white text-3xl font-bold">Loading PRIME...</p>
    </div>
    }
  
  

  return (
    <div className="article">
     
     <Link to='/insight'>
     <button
        className="back-button mt-2 p-6 bg-blue-900 rounded-full"
        // onClick={onBack}
        type="button"
      >
        ← Back
      </button>  
     </Link>
        
      <h1 className="title mt-6 mb-2 text-3xl font-bold tracking-tight text-blue-900">
        {title}
      </h1>
      <p className="content mb-2 text-gray-700">
        {content}
      </p>
      <p className="date text-gray-500">
        {timeDiff} by <soan className="text-blue-900 font-bold">PR!ME Admin</soan>
      </p>

      <BottomNavigation/>
    </div>
  );
};


 

export default Article;
