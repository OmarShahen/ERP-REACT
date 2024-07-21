import { useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { useSelector } from 'react-redux'
import CardTransition from '../transitions/card-transitions'


const ShiftFormModal = ({ reload, setReload, setShowModalForm, setIsUpdate, isDone, activeShift }) => {

    const user = useSelector(state => state.user.user)

    const [isSubmit, setIsSubmit] = useState(false)

    const [totalPrice, setTotalPrice] = useState()
    const [totalPriceError, setTotalPriceError] = useState()
    

    const openShift = (e) => {
        e.preventDefault()

        const shiftData = { cashierId: user._id, openingBalance: Number.parseFloat(totalPrice) }

        setIsSubmit(true)
        serverRequest.post(`/v1/shifts`, shiftData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            reload ? setReload(reload + 1) : null
            setShowModalForm(false)
            toast.success(data.message, { position: 'top-left', duration: 3000 })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            
            try {

                const errorData = error?.response?.data

                if(errorData.field === 'openingBalance') return setTotalPriceError(errorData.message)

                toast.error(error.response.data.message, { position: 'top-left', duration: 3000 })

            } catch(error) {}
        })

    }

    const closeShift = (e) => {
        e.preventDefault()

        const shiftData = { cashierId: user._id, closingBalance: Number.parseFloat(totalPrice) }

        setIsSubmit(true)
        serverRequest.put(`/v1/shifts/${activeShift._id}`, shiftData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            reload ? setReload(reload + 1) : null
            setShowModalForm(false)
            toast.success(data.message, { position: 'top-left', duration: 3000 })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            
            try {

                const errorData = error?.response?.data

                if(errorData.field === 'closingBalance') return setTotalPriceError(errorData.message)

                toast.error(error.response.data.message, { position: 'top-left', duration: 3000 })

            } catch(error) {}
        })

    }

    return <div className="modal">
        <CardTransition>
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>
                    {
                        !isDone ?
                        'اغلاق الوردية'
                        :
                        'فتح الوردية'
                    }
                </h2>
            </div>
            <div className="modal-body-container">
                <form 
                id="lead-form" 
                className="modal-form-container responsive-form body-text right-direction" 
                onSubmit={!isDone ? closeShift : openShift}
                >
                    
                    <div className="form-input-container">
                        <label>مبلغ العهدة</label>
                        <input 
                        type="text" 
                        className="form-input" 
                        placeholder=""
                        value={totalPrice}
                        onChange={e => setTotalPrice(e.target.value)}
                        onClick={() => setTotalPriceError()}
                        />
                        <span className="red">{totalPriceError}</span>
                    </div>
                </form>
            </div>
            <div className="modal-form-btn-container">
                <div>
                    {
                        isSubmit ?
                        <TailSpin width="25" height="25" color="#4c83ee" />
                        :
                        <button 
                        form="lead-form"
                        className="normal-button white-text action-color-bg"
                        >تاكيد</button>
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

export default ShiftFormModal