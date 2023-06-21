import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import visualReducer from '../features/visual/visualSlice';
import adminReducer from '../features/admin/adminSlice'



export const store = configureStore({
  reducer: {
    userauth: userReducer,
    visual: visualReducer,
    adminauth: adminReducer, 
  },
});
