import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    values: []
}

export const valueSlice = createSlice({
    name: 'value',
    initialState,
    reducers: {
        setValues: (state, action) => {
            state.values = action.payload.values
        }
    }
})

const { actions, reducer } = valueSlice

export const { setValues } = actions

export default reducer