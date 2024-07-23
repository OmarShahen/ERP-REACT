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
        },
        addItem: (state, action) => {
            state.items = [...state.items, action.payload]
        }
    }
})

const { actions, reducer } = itemSlice

export const { setItems, addItem } = actions

export default reducer