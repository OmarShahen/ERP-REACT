import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    items: []
}

export const itemSlice = createSlice({
    name: 'item',
    initialState,
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload.items
        }
    }
})

const { actions, reducer } = itemSlice

export const { setItems } = actions

export default reducer