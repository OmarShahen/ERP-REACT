import { createSlice } from "@reduxjs/toolkit"

const userSession = localStorage.getItem('user')

const initialState = {
    user: JSON.parse(userSession) ? JSON.parse(userSession) : { isLogged: false }
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setIsLogged: (state, action) => {
            state.user.isLogged = action.payload
        },
        setMode: (state, action) => {
            state.user.mode = action.payload
        },
        setAccessToken: (state, action) => {
            state.user.accessToken = action.payload
        },
        setUserSpeciality: (state, action) => {
            state.user.speciality = action.payload
        },
        setUserDetails: (state, action) => {
            state.user.firstName = action.payload.firstName
            state.user.lastName = action.payload.lastName
            state.user.gender = action.payload.gender
            state.user.dateOfBirth = action.payload.dateOfBirth
        }
    }
})

const { actions, reducer } = userSlice

export const { setUser, setIsLogged, setMode, setAccessToken, setUserSpeciality, setUserDetails } = actions

export default reducer