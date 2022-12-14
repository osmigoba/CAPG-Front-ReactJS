import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { Login } from '../../httpService'
import Swal from 'sweetalert2'
import CapLogo from '../../Capgemini-logo.jpg'
//Get user from LocalStorage
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: user ? true : false,
    isLoading: false,
    message: ''
}
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timerProgressBar: true,
  })
//lOGIN 
export const login = createAsyncThunk('auth/login', async(user, ThunkAPI) => {
    try {
        const data =  await Login(user)   
          await Toast.fire({
            icon: 'success',
            title: '๐ Login successful',
            timer: 1500
          })
        return data
    } catch (error) {
        const message = error.toString()

        await Toast.fire({
            icon: 'error',
            title: '๐คจ Unauthorized, Please the check email or password',
            timer: 2500
          })
        return ThunkAPI.rejectWithValue(message)
    }
})



export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token') // deletes token from storage
            state.isLoading = false
            state.error = true
            state.message = ''
            state.isSuccess = false
            state.user = null
          },        
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true
            })

            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.error = false
                state.isSuccess = true
                state.user = action.payload
            })

            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.error = true
                state.message = action.payload
                state.user = null
                state.isSuccess = false
            })
           
    }
})

export const { reset, logout } = authSlice.actions
export default authSlice.reducer
