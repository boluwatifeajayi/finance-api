import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import visualService from './visualService'
import axios from 'axios'
const API_URL = '/api'


axios.defaults.withCredentials = true



const initialState = {
  visuals: [],
  singleVisual: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Create new visual
export const createVisual = createAsyncThunk(
  'visuals/create',
  async (visualData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().adminauth.admin.authToken
      return await visualService.createVisual(visualData, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)


// get all visuals
export const allVisuals = createAsyncThunk(
	'visuals/allVisuals',
	async (_, thunkAPI) => {
	  try {
		return await visualService.allVisuals()
	  } catch (error) {
		const message =
		  (error.response &&
			error.response.data &&
			error.response.data.message) ||
		  error.message ||
		  error.toString()
		return thunkAPI.rejectWithValue(message)
	  }
	}
  )

// get visuals by category
export const getVisualsByCategory = createAsyncThunk(
	'visuals/visualsByCategory',
	async (visualCategory, thunkAPI) => {
	  try {
		return await visualService.getVisualsByCategory(visualCategory)
	  } catch (error) {
		const message =
		  (error.response &&
			error.response.data &&
			error.response.data.message) ||
		  error.message ||
		  error.toString()
		return thunkAPI.rejectWithValue(message)
	  }
	}
  )


  // get one visuals
export const GetSingleVisual = createAsyncThunk(
	'visuals/singleVisual',
	async (id, thunkAPI) => {
	  try {
		return await visualService.GetSingleVisual(id)
	  } catch (error) {
		const message =
		  (error.response &&
			error.response.data &&
			error.response.data.message) ||
		  error.message ||
		  error.toString()
		return thunkAPI.rejectWithValue(message)
	  }
	}
  )

  
// apply for visual
export const ApplyForVisual = createAsyncThunk(
  'visuals/apply',
  async ({applyData, visualId}, thunkAPI) => {
    try {
      const token = thunkAPI.getState().studentauth.student.authToken
      return await visualService.ApplyForVisual(applyData, visualId, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)


// delete visual 
export const deleteVisual = createAsyncThunk(
	'visuals/deleteVisual',
	async (visualId, thunkAPI) => {
	  try {
    const token = thunkAPI.getState().adminauth.admin.authToken
		return await visualService.deleteVisual(visualId, token)
	  } catch (error) {
		const docmessage =
		  (error.response &&
			error.response.data &&
			error.response.data.docmessage) ||
		  error.docmessage ||
		  error.toString()
		return thunkAPI.rejectWithValue(docmessage)
	  }
	}
  )

  // update visual 
  export const updateVisual = createAsyncThunk(
    'visuals/updateVisual',
    async ({ visualData, visualId }, thunkAPI) => {
      try {
        const token = thunkAPI.getState().adminauth.admin.authToken
        return await visualService.updateVisual(visualData, visualId, token)
      } catch (error) {
        const docmessage =
          (error.response &&
            error.response.data &&
            error.response.data.docmessage) ||
          error.docmessage ||
          error.toString()
        return thunkAPI.rejectWithValue(docmessage)
      }
    }
  )
  


 


export const visualSlice = createSlice({
  name: 'visual',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },

  // state management for functions 
  extraReducers: (builder) => {
    builder
    // create visual
      .addCase(createVisual.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createVisual.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.visuals.push(action.payload)
      })
      .addCase(createVisual.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      // get all visuals
	  .addCase(allVisuals.pending, (state) => {
        state.isLoading = true
      })
      .addCase(allVisuals.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.visuals = action.payload
      })
      .addCase(allVisuals.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

       // get all visuals category
	  .addCase(getVisualsByCategory.pending, (state) => {
      state.isLoading = true
    })
    .addCase(getVisualsByCategory.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = true
      state.visuals = action.payload
    })
    .addCase(getVisualsByCategory.rejected, (state, action) => {
      state.isLoading = false
      state.isError = true
      state.message = action.payload
    })

   

   

      
      // get single visual
      .addCase(GetSingleVisual.pending, (state) => {
        state.isLoading = true
      })
      .addCase(GetSingleVisual.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.singleVisual = action.payload
      })
      .addCase(GetSingleVisual.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
   
      // apply for visual
      .addCase(ApplyForVisual.pending, (state) => {
        state.isLoading = true
      })
      .addCase(ApplyForVisual.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.singleVisual = action.payload
      })
      .addCase(ApplyForVisual.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      // delete
      //   delete content
      .addCase(deleteVisual.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteVisual.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(deleteVisual.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })  

      // update
      // 
      .addCase(updateVisual.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateVisual.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(updateVisual.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.docmessage = action.payload
      })  
  },
})

export const { reset } = visualSlice.actions
export default visualSlice.reducer
