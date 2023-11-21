import { configureStore } from "@reduxjs/toolkit"
import userReducer from './slices/userSlice'
import patientReducer from './slices/patientSlice'
import sidebarReducer from './slices/sidebarSlice'
import invoiceReducer from './slices/invoiceSlice'
import modalReducer from './slices/modalSlice'
import clinicReducer from './slices/clinicSlice'
import invitationReducer from './slices/invitationSlice'
import billReducer from './slices/billSlice'
import langReducer from './slices/langSlice'
import valueReducer from './slices/valueSlice'


export const store = configureStore({
    reducer: {
        user: userReducer,
        patient: patientReducer,
        sidebar: sidebarReducer,
        invoice: invoiceReducer,
        modal: modalReducer,
        clinic: clinicReducer,
        invitation: invitationReducer,
        bill: billReducer,
        lang: langReducer,
        values: valueReducer
    }
})