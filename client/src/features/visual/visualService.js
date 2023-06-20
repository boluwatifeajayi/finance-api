import axios from 'axios'
const API_URL = 'https://primes-api.cyclic.app/api'

axios.defaults.withCredentials = true



// get all visuals
const allVisuals = async () => {
	const response = await axios.get(`${API_URL}/visuals/all`)
	return response.data
}

// create new visual
const createVisual = async (visualData, token) => {
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
			withCredentials: true,
			Cookie: `authToken=${token}`
		}
	}
	const response = await axios.visual(`${API_URL}/admin/visual/create`, visualData, config, {withCredentials: true})

	return response.data
	
}

// get single visual

const GetSingleVisual = async (id) => {
	const response = await axios.get(`${API_URL}/visuals/${id}`)
	return response.data	
}

// apply for visual

const ApplyForVisual = async (applyData, visualId, token) => {
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
			withCredentials: true,
			Cookie: `authToken=${token}`
		}
	}
	
	const response = await axios.visual(`${API_URL}/visuals/${visualId}/comment`, applyData, config)
	return response.data	
}


// get visuals by category
const getVisualsByCategory = async (visualCategory) => {
	try {
	  const response = await axios.get(`${API_URL}/visuals/category/${visualCategory}`);
	  return response.data;
	} catch (error) {
	  console.error(error);
	}
  };


// delete Visual
const deleteVisual = async (visualId, token) => {
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
			withCredentials: true,
			Cookie: `authToken=${token}`
		}
	}

	try {
	  const response = await axios.delete(`${API_URL}/admin/visual/delete/${visualId}`, config, {withCredentials: true});
	  return response.data;
	} 
	
	catch (error) {
	  console.error(error);
	}
  };

// delete Visual
const updateVisual = async (visualData, visualId, token) => {
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
			withCredentials: true,
			Cookie: `authToken=${token}`
		}
	}

	try {
	  const response = await axios.put(`${API_URL}/admin/visual/update/${visualId}`, visualData, config, {withCredentials: true});
	  console.log("hey")
	  return response.data;
	 
	} 
	
	catch (error) {
	  console.error(error);
	}
  };


const visualService = {
	createVisual,
	allVisuals,
	GetSingleVisual,
	ApplyForVisual,
	getVisualsByCategory,
	deleteVisual,
	updateVisual
	
}


export default visualService