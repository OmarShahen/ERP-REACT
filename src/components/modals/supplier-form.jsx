import { useState, useEffect } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import CardTransition from '../transitions/card-transitions'


const SupplierFormModal = ({ reload, setReload, setShowModalForm, isUpdate, setIsUpdate, supplier }) => {

    const [isSubmit, setIsSubmit] = useState(false)

    const [name, setName] = useState(isUpdate ? supplier.name : '')
    const [phone, setPhone] = useState(isUpdate ? supplier.phone : '')
    const [note, setNote] = useState(isUpdate ? supplier.note : '')
    
    const [nameError, setNameError] = useState()
    const [phoneError, setPhoneError] = useState()
    const [noteError, setNoteError] = useState()

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!name) return setNameError('الاسم مطلوب')

        if(!phone) return setPhoneError('الهاتف مطلوب')

        const supplierData = {
            name,
            phone,
            note
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/suppliers`, supplierData)
        .then(response => {
            setIsSubmit(false)
            setReload ? setReload(reload + 1) : null
            setShowModalForm(false)
            toast.success(response.data.message, { position: 'top-left', duration: 3000 })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            
            try {

                const errorData = error?.response?.data

                if(errorData.field === 'name') return setNameError(errorData.message)

                if(errorData.field === 'phone') return setPhoneError(errorData.message)
                
                toast.error(error.response.data.message, { position: 'top-left', duration: 3000 })

            } catch(error) {}
        })

    }

    const handleUpdate = (e) => {
        e.preventDefault()

        if(!name) return setNameError('الاسم مطلوب')

        if(!phone) return setPhoneError('الهاتف مطلوب')

        const supplierData = { name, phone, note }

        setIsSubmit(true)
        serverRequest.put(`/v1/suppliers/${supplier._id}`, supplierData)
        .then(response => {
            setIsSubmit(false)
            setReload(reload + 1)
            setShowModalForm(false)
            setIsUpdate(false)
            toast.success(response.data.message, { position: 'top-left', duration: 3000 })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            
            try {

                const errorData = error?.response?.data

                if(errorData.field === 'name') return setNameError(errorData.message)

                if(errorData.field === 'phone') return setPhoneError(errorData.message)
                
                toast.error(error.response.data.message, { position: 'top-left', duration: 3000 })

            } catch(error) {}
        })

    }

    return <div className="modal">
        <CardTransition>
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2 className="flex-space-between">
                    { isUpdate ? `تحديث المورد` : 'اضافة مورد'}
                </h2>
            </div>
            <div className="modal-body-container">
                <form 
                id="patient-form" 
                className="modal-form-container responsive-form body-text right-direction" 
                onSubmit={isUpdate ? handleUpdate : handleSubmit}
                >
                    <div className="form-input-container">
                        <label>*الاسم</label>
                        <input
                        type="text"
                        className="form-input"
                        onChange={e => setName(e.target.value)}
                        onClick={() => setNameError()}
                        value={name}
                        />
                        <span className="red">{nameError}</span>
                    </div>                                     
                    <div className="form-input-container">
                        <label>*الهاتف</label>
                        <input
                        type="text"
                        className="form-input"
                        onChange={e => setPhone(e.target.value)}
                        onClick={() => setPhoneError()}
                        value={phone}
                        />
                        <span className="red">{phoneError}</span>
                    </div>
                    
                </form>
                <div className="form-input-container">
                    <label>ملحوظة</label>
                    <textarea
                    className="form-input"
                    rows="5"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    onClick={() => setNoteError()}
                    >
                    </textarea>
                    <span>{noteError}</span>
                </div>

            </div>
            <div className="modal-form-btn-container">
                <div>
                    {
                        isSubmit ?
                        <TailSpin width="25" height="25" color="#4c83ee" />
                        :
                        <button 
                        form="patient-form"
                        className="normal-button white-text action-color-bg"
                        >{isUpdate ? 'تحديث' : 'اضافة'}</button>
                    }
                </div>
                <div>
                    <button 
                    className="normal-button cancel-button"
                    onClick={e => {
                        setShowModalForm(false)
                        setIsUpdate ? setIsUpdate(false) : null
                    }}
                    >الغاء</button>
                </div>
            </div>
        </div>
        </CardTransition>
    </div>
}


export default SupplierFormModal