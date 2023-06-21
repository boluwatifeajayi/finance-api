import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import adminService from './adminService'
import axios from 'axios'

const admin = JSON.parse(localStorage.getItem('admin'))
const adminProfile = JSON.parse(localStorage.getItem('adminProfile'))


const initialState = {
	admin: admin ? admin: null, 
	isError: false,
	isSuccess: false,
	adminProfile: adminProfile ? adminProfile: null,
	isLoading: false,
	theAdmin: {},
	meAdmin: {},
	admins: [],
	message: ''
}

// register admin

export const adminRegister = createAsyncThunk('adminauth/adminregister', async (admin, thunkAPI) => {
	try{
		return await adminService.adminRegister(admin)
	} 
	catch(error) {
		const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
		return thunkAPI.rejectWithValue(message)
	 }
	
})

// login admin
export const adminLogin = createAsyncThunk('adminauth/adminlogin', async (admin, thunkAPI) => {
	try{
		return await adminService.adminLogin(admin)
	} 
	catch(error) {
		const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
		return thunkAPI.rejectWithValue(message)
	 }
	
});



// logout
export const adminLogout =  createAsyncThunk('adminauth/adminlogout', async () => {
	await adminService.adminLogout()
})


export const adminSlice = createSlice({
	name: 'adminauth',
	initialState,

	// standard reducer logic, with auto-generated action types per reducer
	reducers: {
		adminreset: (state) => {
			state.isLoading = false
			state.isError = false
			state.isSuccess = false
			state.message = ''
		}
	},
	extraReducers: (builder) => {
		// Add reducers for additional action types here, and handle various state as needed
		builder
			// register actions
			.addCase(adminRegister.pending, (state) => {
				state.isLoading = true
			})
			.addCase(adminRegister.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true
				state.admin = action.payload
			})
			.addCase(adminRegister.rejected, (state, action) => {
				state.isLoading = false
				state.isError = true
				state.message = action.payload
				state.admin = null
			})

			// login
			.addCase(adminLogin.pending, (state) => {
				state.isLoading = true
			})
			.addCase(adminLogin.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true
				state.admin = action.payload
			})
			.addCase(adminLogin.rejected, (state, action) => {
				state.isLoading = false
				state.isError = true
				state.message = action.payload
				state.admin = null
			})
			// logout
			.addCase(adminLogout.fulfilled, (state) => {
				state.admin = null
			})
	}
})

export const {adminreset} = adminSlice.actions
export default adminSlice.reducer


