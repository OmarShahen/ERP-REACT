import { useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { format } from 'date-fns'


const PromoCodeFormModal = ({ reload, setReload, setShowModalForm, isUpdate, setIsUpdate, promoCode }) => {

    const [isSubmit, setIsSubmit] = useState(false)

    const [code, setCode] = useState(isUpdate ? promoCode.code : '')
    const [discount, setDiscount] = useState(isUpdate ? promoCode.percentage : 0)
    const [maxUsage, setMaxUsage] = useState(isUpdate ? String(promoCode.maxUsage) : '0')
    const [userMaxUsage, setUserMaxUsage] = useState(isUpdate ? promoCode.userMaxUsage : 1)
    const [expirationDate, setExpirationDate] = useState(isUpdate && promoCode.expirationDate ? format(new Date(promoCode.expirationDate), 'yyyy-MM-dd') : '')

    const [codeError, setCodeError] = useState()
    const [discountError, setDiscountError] = useState()
    const [maxUsageError, setMaxUsageError] = useState()
    const [userMaxUsageError, setUserMaxUsageError] = useState()
    const [expirationDateError, setExpirationDateError] = useState()


    const handleSubmit = (e) => {
        e.preventDefault()

        if(!code) return setCodeError('Code is required')

        if(!discount || Number.parseFloat(discount) === 0) return setDiscountError('Discount is required')

        if(Number.parseFloat(discount) > 1 || Number.parseFloat(discount) < 0) return setDiscountError('Discount must be between 0 and 1')
        
        if(!maxUsage || Number.parseInt(maxUsage) !== 0) return setMaxUsageError('Maximum usage is required')

        if(!userMaxUsage || Number.parseInt(userMaxUsage) === 0) return setUserMaxUsageError('User maximum usage is required')

        const promoCodeData = {
            code: code.trim(),
            percentage: Number.parseFloat(discount),
            maxUsage: Number.parseInt(maxUsage),
            userMaxUsage: Number.parseInt(userMaxUsage),
            expirationDate
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/promo-codes`, promoCodeData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            setReload(reload + 1)
            setShowModalForm(false)
            toast.success(data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            
            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'code') return setCodeError(errorResponse.message)

                if(errorResponse.field === 'percentage') return setDiscountError(errorResponse.message)

                if(errorResponse.field === 'maxUsage') return setMaxUsageError(errorResponse.message)

                if(errorResponse.field === 'userMaxUsage') return setUserMaxUsageError(errorResponse.message)

                if(errorResponse.field === 'expirationDate') return setExpirationDateError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }

    const handleUpdate = (e) => {
        e.preventDefault()

        if(!code) return setCodeError('Code is required')

        if(!discount || Number.parseFloat(discount) === 0) return setDiscountError('Discount is required')

        if(Number.parseFloat(discount) > 1 || Number.parseFloat(discount) < 0) return setDiscountError('Discount must be between 0 and 1')
        
        if(!maxUsage && Number.parseInt(maxUsage) !== 0) return setMaxUsageError('Maximum usage is required')

        if(!userMaxUsage || Number.parseInt(userMaxUsage) === 0) return setUserMaxUsageError('User maximum usage is required')

        const promoCodeData = {
            code: code.trim(),
            percentage: Number.parseFloat(discount),
            maxUsage: Number.parseInt(maxUsage),
            userMaxUsage: Number.parseInt(userMaxUsage),
            expirationDate
        }

        setIsSubmit(true)
        serverRequest.put(`/v1/promo-codes/${promoCode._id}`, promoCodeData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            setReload(reload + 1)
            setShowModalForm(false)
            setIsUpdate(false)
            toast.success(data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            
            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'code') return setCodeError(errorResponse.message)

                if(errorResponse.field === 'percentage') return setDiscountError(errorResponse.message)

                if(errorResponse.field === 'maxUsage') return setMaxUsageError(errorResponse.message)

                if(errorResponse.field === 'userMaxUsage') return setUserMaxUsageError(errorResponse.message)

                if(errorResponse.field === 'expirationDate') return setExpirationDateError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }

    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>{ isUpdate ? 'Update Coupon' : 'Add Coupon'}</h2>
            </div>
            <div className="modal-body-container">
                <form 
                id="patient-form" 
                className="modal-form-container responsive-form body-text" 
                onSubmit={isUpdate ? handleUpdate : handleSubmit}
                >
                    <div className="form-input-container">
                        <label>Code</label>
                        <input 
                        type="text" 
                        className="form-input" 
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        onClick={e => setCodeError()}
                        />
                        <span className="red">{codeError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Discount</label>
                        <input 
                        type="number"
                        max="1"
                        className="form-input" 
                        value={discount} 
                        onChange={e => setDiscount(e.target.value)}
                        onClick={e => setDiscountError()}
                        />
                        <span className="red">{discountError}</span>
                   </div>
                   <div className="form-input-container">
                        <label>Maximum usage</label>
                        <input 
                        type="number"
                        className="form-input" 
                        value={maxUsage} 
                        onChange={e => setMaxUsage(e.target.value)}
                        onClick={e => setMaxUsageError()}
                        />
                        <span className="red">{maxUsageError}</span>
                   </div>
                   <div className="form-input-container">
                        <label>User Maximum Usage</label>
                        <input 
                        type="number"
                        className="form-input" 
                        value={userMaxUsage} 
                        onChange={e => setUserMaxUsage(e.target.value)}
                        onClick={e => setUserMaxUsageError()}
                        />
                        <span className="red">{userMaxUsageError}</span>
                   </div>
                   <div className="form-input-container">
                        <label>Expiration Date</label>
                        <input 
                        type="date"
                        className="form-input" 
                        value={expirationDate} 
                        onChange={e => setExpirationDate(e.target.value)}
                        onClick={e => setExpirationDateError()}
                        />
                        <span className="red">{expirationDateError}</span>
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
                        form="patient-form"
                        className="normal-button white-text action-color-bg"
                        >{isUpdate ? 'Update' : 'Create'}</button>
                    }
                </div>
                <div>
                    <button 
                    className="normal-button cancel-button"
                    onClick={e => {
                        setShowModalForm(false)
                        setIsUpdate(false)
                    }}
                    >Close</button>
                </div>
            </div>
        </div>
    </div>
}


export default PromoCodeFormModal