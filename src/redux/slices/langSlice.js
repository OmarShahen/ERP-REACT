import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    lang: 'ar'
}

export const langSlice = createSlice({
    name: 'lang',
    initialState,
    reducers: {
        setLang: (state, action) => {
            state.lang = action.payload
        },
    }
})

const { actions, reducer } = langSlice

export const { setLang } = actions

export default reducer