import { useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'
import translations from '../../i18n'
import SearchLeadsInputField from '../inputs/search-leads'
import { capitalizeFirstLetter, formatBooleanValue, formatStringToBoolean } from '../../utils/formatString'
import { messagesSentPlatforms } from '../../utils/values'
import { mergeDateWithTime } from '../../utils/time'


const MessageSentFormModal = ({ setShowFormModal, reload, setReload, isUpdate, setIsUpdate, messageSent, setMessageSent }) => {

    const lang = useSelector(state => state.lang.lang)
    const messagesTemplates = useSelector(state => state.messagesTemplates.messagesTemplates)

    const [isSubmit, setIsSubmit] = useState(false)

    const [lead, setLead] = useState()
    const [messageTemplate, setMessageTemplate] = useState()
    const [isOpened, setIsOpened] = useState(isUpdate ? messageSent.isOpened : false)
    const [openedDate, setOpenedDate] = useState(isUpdate && messageSent.openedDate ? format(new Date(messageSent.openedDate), 'yyyy-MM-dd') : '')
    const [openedTime, setOpenedTime] = useState(isUpdate && messageSent.openedDate ? format(new Date(messageSent.openedDate), 'HH:mm') : '')
    const [isResponded, setIsResponded] = useState(isUpdate ? messageSent.isResponded : false)
    const [respondedDate, setRespondedDate] = useState(isUpdate && messageSent.respondedDate ? format(new Date(messageSent.respondedDate), 'yyyy-MM-dd') : '')
    const [respondedTime, setRespondedTime] = useState(isUpdate && messageSent.respondedDate ? format(new Date(messageSent.respondedDate), 'HH:mm') : '')
    const [isCTADone, setIsCTADone] = useState(isUpdate ? messageSent.isCTADone : false)
    const [platform, setPlatform] = useState(isUpdate ? messageSent.platform : '')

    const [leadError, setLeadError] = useState()
    const [messageTemplateError, setMessageTemplateError] = useState()
    const [isOpenedError, setIsOpenedError] = useState()
    const [openedDateError, setOpenedDateError] = useState()
    const [openedTimeError, setOpenedTimeError] = useState()
    const [isRespondedError, setIsRespondedError] = useState()
    const [respondedDateError, setRespondedDateError] = useState()
    const [respondedTimeError, setRespondedTimeError] = useState()
    const [isCTADoneError, setIsCTADoneError] = useState()
    const [platformError, setPlatformError] = useState()
    

    const handleSubmit = (e) => {
        e.preventDefault()
        
        if(!lead) return setLeadError('Lead is required')

        if(!messageTemplate) return setMessageTemplateError('Message template is required')

        if(!platform) return setPlatformError('Platform is required')


        const messageSentData = {
            leadId: lead._id,
            messageTemplateId: messageTemplate,
            platform
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/crm/messages-sent`, messageSentData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            setReload ? setReload(reload + 1) : null
            setShowFormModal(false)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            try {

                const errorResponse = error.response.data

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {
                toast.error(error.message, { position: 'top-right', duration: 3000 })
            }
        })

    }

    const handleUpdate = (e) => {
        e.preventDefault()

        if(isOpened && !openedDate) return setOpenedDateError('Opened date is required')

        if(isOpened && !openedTime) return setOpenedTimeError('Opened time is required')

        if(isResponded && !respondedDate) return setRespondedDateError('Responded date is required')

        if(isResponded && !respondedTime) return setRespondedTimeError('Responded time is required')

        const openedDateTime = isOpened ? mergeDateWithTime(openedDate, openedTime) : null
        const respondedDateTime = isResponded ? mergeDateWithTime(respondedDate, respondedTime) : null

        const messageSentData = {
            platform,
            isOpened,
            isResponded,
            isCTADone,
            openedDate: openedDateTime,
            respondedDate: respondedDateTime
        }

        setIsSubmit(true)
        serverRequest.put(`/v1/crm/messages-sent/${messageSent._id}`, messageSentData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            setReload ? setReload(reload + 1) : null
            setMessageSent ? setMessageSent({}) : null
            setIsUpdate ? setIsUpdate(false) : null
            setShowFormModal(false)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            try {

                const errorResponse = error?.response?.data

                if(errorResponse.field === 'stage') return setStatusError(errorResponse.message)

                toast.error(error?.response?.data?.message, { position: 'top-right', duration: 3000 })

            } catch(error) {
                toast.error(error.message, { position: 'top-right', duration: 3000 })
            }
        })

    }

    const booleanValues = ['YES', 'NO']

    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>{isUpdate ? 'Update Message Sent' : 'Create Message Sent'}</h2>
            </div>
            <div>
                <div className="modal-body-container">
                    <form 
                    id="message-sent-form" 
                    className="modal-form-container responsive-form body-text" 
                    onSubmit={isUpdate ? handleUpdate : handleSubmit}>
                        {
                            isUpdate ?
                            <div className="form-input-container">
                                <label>Lead</label>
                                <input 
                                type="text"
                                className="form-input"
                                value={messageSent?.lead?.name}
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
                            <label>Message Template</label>
                            {
                                isUpdate ?
                                <input 
                                type="text"
                                disabled
                                className="form-input"
                                value={messageSent?.messageTemplate?.name}
                                />
                                :
                                <select
                                className="form-input"
                                onChange={e => setMessageTemplate(e.target.value)}
                                onClick={e => setMessageTemplateError()}
                                >
                                    <option disabled selected>Select Template</option>
                                    {messagesTemplates.map(message => {
                                        return <option value={message._id}>{message.name}</option>
                                    })}
                                    
                                </select>
                            }
                            <span className="red">{messageTemplateError}</span>
                        </div>
                    <div className="form-input-container">
                        <label>Platform</label>
                        <select
                        className="form-input"
                        onClick={e => setPlatformError()}
                        onChange={e => setPlatform(e.target.value)}
                        >
                            <option selected disabled>Select Platform</option>
                            {messagesSentPlatforms.map(messagePlatform => {
                                if(messagePlatform === messageSent.platform) {
                                    return <option selected value={messagePlatform}>{capitalizeFirstLetter(messagePlatform)}</option>    
                                }
                                return <option value={messagePlatform}>{capitalizeFirstLetter(messagePlatform)}</option>
                            })}
                        </select>
                        <span className="red">{platformError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Call To Action Done</label>
                        <select
                        disabled={!isUpdate}
                        className="form-input"
                        onClick={e => setIsCTADoneError()}
                        onChange={e => setIsCTADone(formatStringToBoolean(e.target.value))}
                        >
                            <option selected disabled>Select Value</option>
                            {booleanValues.map(booleanValue => {
                                if(booleanValue.toLowerCase() === formatBooleanValue(messageSent.isCTADone).toLowerCase()) {
                                    return <option selected value={booleanValue}>{capitalizeFirstLetter(booleanValue)}</option>
                                }
                                return <option value={booleanValue}>{capitalizeFirstLetter(booleanValue)}</option>
                            })}
                        </select>
                        <span className="red">{isCTADoneError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Message Opened</label>
                        <select
                        disabled={!isUpdate}
                        className="form-input"
                        onClick={e => setIsOpenedError()}
                        onChange={e => setIsOpened(formatStringToBoolean(e.target.value))}
                        >
                            <option selected disabled>Select Value</option>
                            {booleanValues.map(booleanValue => {
                                if(booleanValue.toLowerCase() === formatBooleanValue(messageSent.isOpened).toLowerCase()) {
                                    return <option selected value={booleanValue}>{capitalizeFirstLetter(booleanValue)}</option>
                                }
                                return <option value={booleanValue}>{capitalizeFirstLetter(booleanValue)}</option>
                            })}
                        </select>
                        <span className="red">{isOpenedError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Message Responded</label>
                        <select
                        disabled={!isUpdate}
                        className="form-input"
                        onClick={e => setIsRespondedError()}
                        onChange={e => setIsResponded(formatStringToBoolean(e.target.value))}
                        >
                            <option selected disabled>Select Value</option>
                            {booleanValues.map(booleanValue => {
                                if(booleanValue.toLowerCase() === formatBooleanValue(messageSent.isResponded).toLowerCase()) {
                                    return <option selected value={booleanValue}>{capitalizeFirstLetter(booleanValue)}</option>
                                }
                                return <option value={booleanValue}>{capitalizeFirstLetter(booleanValue)}</option>
                            })}
                        </select>
                        <span className="red">{isRespondedError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Opened Date</label>
                        <input 
                        type="date"
                        disabled={!isUpdate}
                        className="form-input"
                        onClick={e => setOpenedDateError()}
                        onChange={e => setOpenedDate(e.target.value)}
                        value={openedDate}
                        />
                        <span className="red">{openedDateError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Opened Time</label>
                        <input 
                        type="time"
                        disabled={!isUpdate}
                        className="form-input"
                        onClick={e => setOpenedTimeError()}
                        onChange={e => setOpenedTime(e.target.value)}
                        value={openedTime}
                        />
                        <span className="red">{openedTimeError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Responded Date</label>
                        <input 
                        type="date"
                        disabled={!isUpdate}
                        className="form-input"
                        onClick={e => setRespondedDateError()}
                        onChange={e => setRespondedDate(e.target.value)}
                        value={respondedDate}
                        />
                        <span className="red">{respondedDateError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Responded Time</label>
                        <input 
                        type="time"
                        disabled={!isUpdate}
                        className="form-input"
                        onClick={e => setRespondedTimeError()}
                        onChange={e => setRespondedTime(e.target.value)}
                        value={respondedTime}
                        />
                        <span className="red">{respondedTimeError}</span>
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
                            form="message-sent-form"
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
                            setMessageSent ? setMessageSent({}) : null
                            setShowFormModal(false)
                        }}
                        >{translations[lang]['Close']}</button>
                    </div>
                </div>
            </div>            
        </div>
    </div>
}

export default MessageSentFormModal