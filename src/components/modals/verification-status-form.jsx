import { useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { capitalizeFirstLetter } from '../../utils/formatString'


const VerificationStatusFormModal = ({ reload, setReload, setShowModalForm, appointment }) => {

    const [isSubmit, setIsSubmit] = useState(false)

    const [verification, setVerification] = useState(appointment?.verification)
    const [verificationError, setVerificationError] = useState()


    const handleSubmit = (e) => {
        e.preventDefault()

        if(!verification) return setVerificationError('Verification is required')

        const verificationData = { verification }

        setIsSubmit(true)
        serverRequest.patch(`/v1/appointments/${appointment._id}/verification`, verificationData)
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

                if(errorResponse.field === 'verification') return setVerificationError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }


    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>Update Verification Status #{appointment?.appointmentId}</h2>
            </div>
            <div className="modal-body-container">
                <form 
                id="patient-form" 
                className="modal-form-container responsive-form body-text" 
                onSubmit={handleSubmit}
                >
                    <div className="form-input-container">
                        <label>Verification Status</label>
                        <select
                        onClick={() => setVerificationError()}
                        onChange={e => setVerification(e.target.value)}
                        >
                            <option selected disabled>Select Verification Status</option>
                            {['REVIEW', 'ACCEPTED', 'REJECTED'].map(status => {
                                if(status === verification) {
                                    return <option value={status} selected>{capitalizeFirstLetter(status)}</option>
                                }
                                return <option value={status}>{capitalizeFirstLetter(status)}</option>
                            })}
                        </select>
                        <span className="red">{verificationError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Transaction ID</label>
                        <input
                        type="text"
                        className="form-input"
                        disabled
                        value={appointment?.payment?.transactionId}
                        placeholder='Transaction ID'
                        />
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
                        >Update</button>
                    }
                </div>
                <div>
                    <button 
                    className="normal-button cancel-button"
                    onClick={() => {
                        setShowModalForm(false)
                        setIsUpdate(false)
                    }}
                    >Close</button>
                </div>
            </div>
        </div>
    </div>
}


export default VerificationStatusFormModal