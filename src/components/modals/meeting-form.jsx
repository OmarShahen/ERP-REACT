import { useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'
import translations from '../../i18n'
import SearchLeadsInputField from '../inputs/search-leads'
import { capitalizeFirstLetter } from '../../utils/formatString'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'



const MeetingFormModal = ({ setShowFormModal, reload, setReload, isUpdate, setIsUpdate, meeting, setMeeting }) => {

    const lang = useSelector(state => state.lang.lang)

    const [isSubmit, setIsSubmit] = useState(false)

    const [lead, setLead] = useState()
    const [status, setStatus] = useState('UPCOMING')
    const [reservationDate, setReservationDate] = useState(isUpdate ? format(new Date(meeting.reservationTime), 'yyyy-MM-dd') : null)
    const [reservationTime, setReservationTime] = useState(isUpdate ? format(new Date(meeting.reservationTime), 'HH:mm') : null)

    const [leadError, setLeadError] = useState()
    const [statusError, setStatusError] = useState()
    const [reservationDateError, setReservationDateError] = useState()
    const [reservationTimeError, setReservationTimeError] = useState()

    const meetingStatus = ['UPCOMING', 'DONE', 'RESCHEDULED', 'CANCELLED']

    
    const deleteMeeting = () => {
        setIsSubmit(true)
        serverRequest.delete(`/v1/crm/meetings/${meeting._id}`)
        .then(response => {
            setIsSubmit(false)
            toast.success(response.data.message, { position: 'top-right', duration: 3000 })
            setReload(reload + 1)
            setMeeting()
            setIsUpdate(false)
            setShowFormModal(false)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            return toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        if(!lead) return setLeadError('Lead is required')

        if(!reservationDate) return setReservationDateError(translations[lang]['reservation date is required'])

        if(!reservationTime) return setReservationTimeError(translations[lang]['reservation time is required'])

        const [year, month, day] = reservationDate.split('-').map(Number)
        const [hours, minutes] = reservationTime.split(':').map(Number)
        const seconds = 0

        const bookDate = new Date(year, month - 1, day, hours, minutes, seconds)

        const meetingData = {
            leadId: lead._id,
            reservationTime: bookDate,
            status,
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/crm/meetings`, meetingData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            reload ? setReload(reload + 1) : null
            setShowFormModal(false)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'reservationTime') return setReservationDateError(errorResponse.message)

                if(errorResponse.field === 'status') return setStatusError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {
                toast.error(error.message, { position: 'top-right', duration: 3000 })
            }
        })

    }

    const handleUpdate = (e) => {
        e.preventDefault()

        const meetingData = {
            status,
        }

        setIsSubmit(true)
        serverRequest.patch(`/v1/crm/meetings/${meeting._id}/status`, meetingData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            setReload(reload + 1)
            setMeeting()
            setIsUpdate(false)
            setShowFormModal(false)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'status') return setStatusError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {
                toast.error(error.message, { position: 'top-right', duration: 3000 })
            }
        })

    }

    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>{isUpdate ? 'Update Meeting' : 'Create Meeting'}</h2>
                {
                    isUpdate ?
                    <span className="hover" onClick={e => deleteMeeting()}>
                        <DeleteOutlineOutlinedIcon />
                    </span>
                    :
                    null
                }
            </div>
            <div>
                <div className="modal-body-container">
                    <form 
                    id="appointment-form" 
                    className="modal-form-container responsive-form body-text" 
                    onSubmit={isUpdate ? handleUpdate : handleSubmit}>
                        {
                            isUpdate ?
                            <div className="form-input-container">
                                <label>Lead</label>
                                <input 
                                type="text"
                                className="form-input"
                                value={meeting?.lead?.name}
                                disabled
                                />
                            </div>
                            :
                            <SearchLeadsInputField 
                            setTargetLead={setLead}
                            setTargetLeadError={setLeadError}
                            targetLeadError={leadError}
                            />
                        }
                        <div className="form-input-container">
                            <label>{translations[lang]['Reservation Date']}  {translations[lang]['(month/day/year)']}</label>
                            <input 
                            type="date" 
                            className="form-input" 
                            disabled={isUpdate}
                            value={reservationDate}
                            onChange={e => setReservationDate(e.target.value)}
                            onClick={e => setReservationDateError()}
                            />
                            <span className="red">{reservationDateError}</span>
                        </div>
                        <div className="form-input-container">
                            <label>{translations[lang]['Reservation Time']}</label>
                            <input 
                            type="time" 
                            className="form-input" 
                            disabled={isUpdate}
                            value={reservationTime}
                            onChange={e => setReservationTime(e.target.value)}
                            onClick={e => setReservationTimeError()}
                            />
                            <span className="red">{reservationTimeError}</span>
                        </div>
                        <div className="form-input-container">
                            <label>{translations[lang]['Status']}</label>
                            <select
                            className="form-input"
                            onClick={e => setStatusError()}
                            onChange={e => setStatus(e.target.value)}
                            >
                                {meetingStatus.map(status => {
                                    if(status === meeting?.status) {
                                        return <option selected value={status}>{capitalizeFirstLetter(status)}</option>
                                    }
                                    return <option value={status}>{capitalizeFirstLetter(status)}</option>
                                })}
                            </select>
                            <span className="red">{statusError}</span>
                        </div>
                    </form>
                </div>
                <div className="modal-form-btn-container">
                    <div>   
                        { 
                            isSubmit ?
                            <TailSpin
                            height="25"
                            width="25"
                            color="#4c83ee"
                            />
                            :
                            <button
                            form="appointment-form"
                            className="normal-button white-text action-color-bg"
                            >{isUpdate ? 'Update' : 'Create'}</button>
                        } 
                    </div>
                    <div>
                        <button 
                        className="normal-button cancel-button"
                        onClick={e => {
                            e.preventDefault()
                            setIsUpdate ? setIsUpdate() : null
                            setMeeting ? setMeeting() : null
                            setShowFormModal(false)
                        }}
                        >{translations[lang]['Close']}</button>
                    </div>
                </div>
            </div>            
        </div>
    </div>
}

export default MeetingFormModal