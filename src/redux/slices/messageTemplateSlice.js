import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    messagesTemplates: []
}

export const messageTemplateSlice = createSlice({
    name: 'messageTemplate',
    initialState,
    reducers: {
        setMessagesTemplates: (state, action) => {
            state.messagesTemplates = action.payload.messagesTemplates
        }
    }
})

const { actions, reducer } = messageTemplateSlice

export const { setMessagesTemplates } = actions

export default reducer