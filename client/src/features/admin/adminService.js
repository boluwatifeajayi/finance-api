import axios from 'axios'

const API_URL = '/api'

axios.defaults.withCredentials = true

// register admin

const adminRegister = async(adminData) => {
	const response = await axios.post(`${API_URL}/admin/signUp`, adminData , {withCredentials: true})

	if(response.data){
		localStorage.setItem('admin', JSON.stringify(response.data))
	}

	return response.data
}

// login admin

const adminLogin = async(adminData) => {
	const response = await axios.post(`${API_URL}/admin/signIn`, adminData, {withCredentials:true})

	if(response.data){
		localStorage.setItem('admin', JSON.stringify(response.data))
	}

	return response.data
}

// logout
const adminLogout = () => {
	localStorage.removeItem('admin')
}


// const getAdminProfile = async(token) => {
// 	const config = {
// 		headers: {
// 			Authorization: `Bearer ${token}`,
// 			withCredentials: true,
// 			Cookie: `authToken=${token}`
// 		}
// 	}
// 	const response = await axios.get(`${API_URL}/company/profile`, config)
// 	console.log(response.data)
// 	return response.data	

// }



const adminService = {
	adminRegister,
	adminLogin,
	adminLogout,
	// getAdminProfile,
}

export default adminService