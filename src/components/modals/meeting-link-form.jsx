import { useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'


const MeetingLinkFormModal = ({ reload, setReload, setShowModalForm, appointment }) => {

    const [isSubmit, setIsSubmit] = useState(false)

    const [meetingLink, setMeetingLink] = useState(appointment?.meetingLink)

    const [meetingLinkError, setMeetingLinkError] = useState()


    const handleSubmit = (e) => {
        e.preventDefault()

        if(!meetingLink) return setMeetingLinkError('Meeting link is required')

        const meetingLinkData = { meetingLink }

        setIsSubmit(true)
        serverRequest.patch(`/v1/appointments/${appointment._id}/meeting-link`, meetingLinkData)
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

                if(errorResponse.field === 'meetingLink') return setMeetingLinkError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }


    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>Add Meeting Link #{appointment?.appointmentId}</h2>
            </div>
            <div className="modal-body-container">
                <form 
                id="patient-form" 
                className="modal-form-container responsive-form body-text" 
                onSubmit={handleSubmit}
                >
                    <div className="form-input-container">
                        <label>Meeting Link</label>
                        <input 
                        type="url" 
                        className="form-input" 
                        placeholder=""
                        value={meetingLink}
                        onChange={e => setMeetingLink(e.target.value)}
                        onClick={e => setMeetingLinkError()}
                        />
                        <span className="red">{meetingLinkError}</span>
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
                        >Add</button>
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

export default MeetingLinkFormModal