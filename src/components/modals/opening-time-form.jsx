import { useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'
import translations from '../../i18n'
import SearchLeadsInputField from '../inputs/search-leads'
import { WEEK_DAYS } from '../../utils/time'
import { capitalizeFirstLetter } from '../../utils/formatString'


const OpeningTimeFormModal = ({ setShowFormModal, reload, setReload, isUpdate, setIsUpdate, openingTimeObj, setOpeningTimeObj }) => {

    const integrateTimeToDate = (hours, minutes) => {
        const todayDate = new Date()
        todayDate.setHours(hours)
        todayDate.setMinutes(minutes)

        return todayDate
    }

    const pagePath = window.location.pathname
    const expertId = pagePath.split('/')[2]

    const lang = useSelector(state => state.lang.lang)

    const [isSubmit, setIsSubmit] = useState(false)

    const [weekday, setWeekday] = useState(isUpdate ? openingTimeObj.weekday : '')
    const [openingTime, setOpeningTime] = useState(isUpdate ? format(integrateTimeToDate(openingTimeObj.openingTime.hour, openingTimeObj.openingTime.minute), 'HH:mm') : null)
    const [closingTime, setClosingTime] = useState(isUpdate ? format(integrateTimeToDate(openingTimeObj.closingTime.hour, openingTimeObj.closingTime.minute), 'HH:mm') : null)

    const [weekdayError, setWeekdayError] = useState()
    const [openingTimeError, setOpeningTimeError] = useState()
    const [closingTimeError, setClosingTimeError] = useState()
    
    const handleSubmit = (e) => {
        e.preventDefault()
        
        if(!weekday) return setWeekdayError('Weekday is required')

        if(!openingTime) return setOpeningTimeError('Opening time is required')

        if(!closingTime) return setClosingTimeError('Closing time is required')

        const openingTimeData = {
            expertId,
            weekday,
            openingTime,
            closingTime
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/opening-times`, openingTimeData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            reload ? setReload(reload + 1) : null
            //setShowFormModal(false)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'weekday') return setWeekdayError(errorResponse.message)

                if(errorResponse.field === 'openingTime') return setOpeningTimeError(errorResponse.message)

                if(errorResponse.field === 'closingTime') return setClosingTimeError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {
                toast.error(error.message, { position: 'top-right', duration: 3000 })
            }
        })

    }

    const handleUpdate = (e) => {
        e.preventDefault()
        
        if(!weekday) return setWeekdayError('Weekday is required')

        if(!openingTime) return setOpeningTimeError('Opening time is required')

        if(!closingTime) return setClosingTimeError('Closing time is required')

        const openingTimeData = {
            weekday,
            openingTime,
            closingTime
        }

        setIsSubmit(true)
        serverRequest.put(`/v1/opening-times/${openingTimeObj._id}`, openingTimeData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            reload ? setReload(reload + 1) : null
            setIsUpdate(false)
            setOpeningTimeObj({})
            setShowFormModal(false)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'weekday') return setWeekdayError(errorResponse.message)

                if(errorResponse.field === 'openingTime') return setOpeningTimeError(errorResponse.message)

                if(errorResponse.field === 'closingTime') return setClosingTimeError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {
                toast.error(error.message, { position: 'top-right', duration: 3000 })
            }
        })
    }

    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>{isUpdate ? 'Update Opening Time' : 'Create Opening Time'}</h2>
            </div>
            <div>
                <div className="modal-body-container">
                    <form 
                    id="opening-time-form" 
                    className="modal-form-container responsive-form body-text" 
                    onSubmit={isUpdate ? handleUpdate : handleSubmit}>
                        <div className="form-input-container">
                            <label>Day</label>
                            <select 
                            className="form-input"
                            onClick={e => setWeekdayError()}
                            onChange={e => setWeekday(e.target.value)}
                            >
                                <option selected disabled>Select Day</option>
                                {WEEK_DAYS.map(targetWeekday => {
                                    if(targetWeekday?.toUpperCase() === weekday?.toUpperCase()) {
                                        return <option selected value={targetWeekday}>{capitalizeFirstLetter(targetWeekday)}</option>
                                    }
                                    return <option value={targetWeekday}>{capitalizeFirstLetter(targetWeekday)}</option>
                                })}
                            </select>
                            <span className="red">{weekdayError}</span>
                        </div>
                        <div className="form-input-container">
                            <label>Opening Time</label>
                            <input 
                            type="time" 
                            className="form-input" 
                            value={openingTime}
                            onChange={e => setOpeningTime(e.target.value)}
                            onClick={e => setOpeningTimeError()}
                            />
                            <span className="red">{openingTimeError}</span>
                        </div>
                        <div className="form-input-container">
                            <label>Closing Time</label>
                            <input 
                            type="time" 
                            className="form-input" 
                            value={closingTime}
                            onChange={e => setClosingTime(e.target.value)}
                            onClick={e => setClosingTimeError()}
                            />
                            <span className="red">{closingTimeError}</span>
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
                            form="opening-time-form"
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
                            setOpeningTimeObj ? setOpeningTimeObj() : null
                            setShowFormModal(false)
                        }}
                        >{translations[lang]['Close']}</button>
                    </div>
                </div>
            </div>            
        </div>
    </div>
}


export default OpeningTimeFormModal