import { configureStore } from "@reduxjs/toolkit"
import authReducer from './authSlice'
import userReducer from './userSlice'

// xuất cho file index.js
export default configureStore({
    reducer: {
        auth: authReducer,
        users: userReducer
    },
});
