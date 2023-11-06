import { useState, useEffect } from "react"
import './patients.css'
import { TailSpin } from "react-loader-spinner"
import { serverRequest } from "../components/API/request"
import { toast } from "react-hot-toast"
import PageHeader from "../components/sections/page-header"
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux"
import translations from "../i18n"
import { useSearchParams } from 'react-router-dom'
import CircularLoading from "../components/loadings/circular"
import { experienceRateList, explanationRateList, satisfactionRateList } from '../utils/experience-translator'
import { capitalizeFirstLetter } from "../utils/formatString"


const PatientFormPage = ({ roles }) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const pagePath = window.location.pathname
    const clinicId = pagePath.split('/')[2]
    const patientId = pagePath.split('/')[4]
    const patientSurveyId = pagePath.split('/')[2]

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [searchParams, setSearchParams] = useSearchParams()
    const mode = searchParams.get('mode')

    const [arrivalMethods, setArrivalMethods] = useState([])

    const [patient, setPatient] = useState({})
    const [patientSurvey, setPatientSurvey] = useState({})

    const [isUpdate, setIsUpdate] = useState(mode === 'UPDATE' ? true : false)
    const [isLoadPatient, setIsLoadPatient] = useState(mode === 'UPDATE' ? true : false)

    const [isSubmit, setIsSubmit] = useState(false)

    const [arrivalMethod, setArrivalMethod] = useState()
    const [overallExperience, setOverallExperience] = useState()
    const [callDuration, setCallDuration] = useState()
    const [waitingTimeWaited, setWaitingTimeWaited] = useState()
    const [waitingIsDelayHappened, setWaitingIsDelayHappened] = useState()
    const [waitingIsDelayInformed, setWaitingIsDelayInformed] = useState()
    const [waitingSatisfaction, setWaitingSatisfaction] = useState()
    const [environmentIsClean, setEnvironmentIsClean] = useState()
    const [environmentIsComfortable, setEnvironmentIsComfortable] = useState()
    const [staffIsFriendly, setStaffIsFriendly] = useState()
    const [staffIsResponsive, setStaffIsResponsive] = useState()
    const [healthcareProviderAttentiveness, setHealthcareProviderAttentiveness] = useState()
    const [healthcareProviderIsAddressedAdequately, setHealthcareProviderIsAddressedAdequately] = useState()
    const [healthcareProviderTreatmentExplanation, setHealthcareProviderTreatmentExplanation] = useState()
    const [healthcareProviderIsMedicalHistoryAsked, setHealthcareProviderIsMedicalHistoryAsked] = useState()
    const [appointmentsIsConvenientTimeSlotFound, setAppointmentsIsConvenientTimeSlotFound] = useState()
    const [appointmentsIsSchedulingEasy, setAppointmentsIsSchedulingEasy] = useState()
    const [appointmentsIsReminderSent, setAppointmentsIsReminderSent] = useState()
    const [appointmentsSchedulingWay, setAppointmentsSchedulingWay] = useState()

    const [arrivalMethodError, setArrivalMethodError] = useState()
    const [overallExperienceError, setOverallExperienceError] = useState()
    const [callDurationError, setCallDurationError] = useState()
    const [waitingTimeWaitedError, setWaitingTimeWaitedError] = useState()
    const [waitingIsDelayHappenedError, setWaitingIsDelayHappenedError] = useState()
    const [waitingIsDelayInformedError, setWaitingIsDelayInformedError] = useState()
    const [waitingSatisfactionError, setWaitingSatisfactionError] = useState()
    const [environmentIsCleanError, setEnvironmentIsCleanError] = useState()
    const [environmentIsComfortableError, setEnvironmentIsComfortableError] = useState()
    const [staffIsFriendlyError, setStaffIsFriendlyError] = useState()
    const [staffIsResponsiveError, setStaffIsResponsiveError] = useState()
    const [healthcareProviderAttentivenessError, setHealthcareProviderAttentivenessError] = useState()
    const [healthcareProviderIsAddressedAdequatelyError, setHealthcareProviderIsAddressedAdequatelyError] = useState()
    const [healthcareProviderTreatmentExplanationError, setHealthcareProviderTreatmentExplanationError] = useState()
    const [healthcareProviderIsMedicalHistoryAskedError, setHealthcareProviderIsMedicalHistoryAskedError] = useState()
    const [appointmentsIsConvenientTimeSlotFoundError, setAppointmentsIsConvenientTimeSlotFoundError] = useState()
    const [appointmentsIsSchedulingEasyError, setAppointmentsIsSchedulingEasyError] = useState()
    const [appointmentsIsReminderSentError, setAppointmentsIsReminderSentError] = useState()
    const [appointmentsSchedulingWayError, setAppointmentsSchedulingWayError] = useState()

    const agreementList = ['YES', 'NO']

    useEffect(() => {
        //isRolesValid(user.roles, roles) ? null : navigate('/login')
        scroll(0, 0)
    }, [])

    useEffect(() => {

        if(!isUpdate) {
            return
        }

        setIsLoadPatient(true)
        serverRequest.get(`/v1/patients-surveys/${patientSurveyId}`)
        .then(response => {
            setIsLoadPatient(false)

            const patientSurvey = response.data.patientSurvey

            setPatientSurvey(patientSurvey)

            setArrivalMethod(patientSurvey.arrivalMethodId)
            setOverallExperience(patientSurvey.overallExperience)
            setCallDuration(patientSurvey.callDuration)
            setWaitingTimeWaited(patientSurvey.waiting.timeWaited)
            setWaitingIsDelayHappened(patientSurvey.waiting.isDelayHappened)
            setWaitingIsDelayInformed(patientSurvey.waiting.isDelayInformed)
            setWaitingSatisfaction(patientSurvey.waiting.waitingSatisfaction)
            setEnvironmentIsClean(patientSurvey.environment.isClean)
            setEnvironmentIsComfortable(patientSurvey.environment.isComfortable)
            setStaffIsFriendly(patientSurvey.staff.isFriendly)
            setStaffIsResponsive(patientSurvey.staff.isResponsive)
            setHealthcareProviderAttentiveness(patientSurvey.healthcareProvider.attentiveness)
            setHealthcareProviderIsAddressedAdequately(patientSurvey.healthcareProvider.isAddressedAdequately)
            setHealthcareProviderTreatmentExplanation(patientSurvey.healthcareProvider.treatmentExplanation)
            setHealthcareProviderIsMedicalHistoryAsked(patientSurvey.healthcareProvider.isMedicalHistoryAsked)
            setAppointmentsIsConvenientTimeSlotFound(patientSurvey.appointments.isConvenientTimeSlotFound)
            setAppointmentsIsSchedulingEasy(patientSurvey.appointments.isSchedulingEasy)
            setAppointmentsIsReminderSent(patientSurvey.appointments.isReminderSent)
            setAppointmentsSchedulingWay(patientSurvey.appointments.schedulingWay)
            
        })
        .catch(error => {
            setIsLoadPatient(false)
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [])

    useEffect(() => {
        serverRequest.get('/v1/arrival-methods')
        .then(response => {
            setArrivalMethods(response.data.arrivalMethods)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [])

    useEffect(() => {

        if(isUpdate) {
            return
        }

        serverRequest.get(`/v1/patients/${patientId}`)
        .then(response => {
            setPatient(response.data.patient)
        })
        .catch(error => {
            console.error(error)
        })
    }, [])

    const getTheBooleanValue = (value) => {
        
        if(value === 'YES') {
            return true
        } else if(value === 'NO') {
            return false
        }

        return null
    }

    const schedulingWays = ['PHONE-CALL', 'IN-PERSON', 'ONLINE']

    const formatValue = (value) => {

        if(typeof value !== 'boolean') {
            return 'Not Registered'
        } else if(value === true) {
            return 'YES'
        } else if(value === false) {
            return 'NO'
        }
    }

    const handleSubmit = () => {

        const patientSurveyData = {
            arrivalMethodId: arrivalMethod,
            clinicId,
            doneById: user._id,
            patientId,
            overallExperience: Number.parseInt(overallExperience),
            callDuration: Number.parseInt(callDuration),
            waitingTimeWaited: Number.parseInt(waitingTimeWaited),
            waitingIsDelayHappened,
            waitingIsDelayInformed,
            waitingSatisfaction: Number.parseInt(waitingSatisfaction),
            environmentIsClean,
            environmentIsComfortable,
            staffIsFriendly,
            staffIsResponsive,
            healthcareProviderAttentiveness: Number.parseInt(healthcareProviderAttentiveness),
            healthcareProviderIsAddressedAdequately,
            healthcareProviderTreatmentExplanation: Number.parseInt(healthcareProviderTreatmentExplanation),
            healthcareProviderIsMedicalHistoryAsked,
            appointmentsIsConvenientTimeSlotFound,
            appointmentsIsSchedulingEasy,
            appointmentsIsReminderSent,
            appointmentsSchedulingWay
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/patients-surveys`, patientSurveyData)
        .then(response => {
            setIsSubmit(false)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
            navigate('/patients-surveys')

        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            if(error?.response?.data?.field === 'arrivalMethodId') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setArrivalMethodError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'overallExperience') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setOverallExperienceError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'callDuration') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setCallDurationError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'waitingTimeWaited') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setWaitingTimeWaitedError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'waitingIsDelayHappened') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setWaitingIsDelayHappenedError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'waitingIsDelayInformed') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setWaitingIsDelayInformedError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'waitingSatisfaction') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setWaitingSatisfactionError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'environmentIsClean') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setEnvironmentIsCleanError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'environmentIsComfortable') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setEnvironmentIsComfortableError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'staffIsFriendly') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setStaffIsFriendlyError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'staffIsResponsive') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setStaffIsResponsiveError(error?.response?.data?.message)
                return
            }
            
            if(error?.response?.data?.field === 'healthcareProviderAttentiveness') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setHealthcareProviderAttentivenessError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'healthcareProviderIsAddressedAdequately') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setHealthcareProviderIsAddressedAdequatelyError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'healthcareProviderTreatmentExplanation') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setHealthcareProviderTreatmentExplanationError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'healthcareProviderIsMedicalHistoryAsked') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setHealthcareProviderIsMedicalHistoryAskedError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'appointmentsIsConvenientTimeSlotFound') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setAppointmentsIsConvenientTimeSlotFoundError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'appointmentsIsSchedulingEasy') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setAppointmentsIsSchedulingEasyError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'appointmentsIsReminderSent') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setAppointmentsIsReminderSentError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'appointmentsSchedulingWay') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setAppointmentsSchedulingWayError(error?.response?.data?.message)
                return
            }

            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })

        })
    }

    const handleUpdate = () => {

        const patientSurveyData = {
            arrivalMethodId: arrivalMethod,
            overallExperience: Number.parseInt(overallExperience),
            callDuration: Number.parseInt(callDuration),
            waitingTimeWaited: Number.parseInt(waitingTimeWaited),
            waitingIsDelayHappened,
            waitingIsDelayInformed,
            waitingSatisfaction: Number.parseInt(waitingSatisfaction),
            environmentIsClean,
            environmentIsComfortable,
            staffIsFriendly,
            staffIsResponsive,
            healthcareProviderAttentiveness: Number.parseInt(healthcareProviderAttentiveness),
            healthcareProviderIsAddressedAdequately,
            healthcareProviderTreatmentExplanation: Number.parseInt(healthcareProviderTreatmentExplanation),
            healthcareProviderIsMedicalHistoryAsked,
            appointmentsIsConvenientTimeSlotFound,
            appointmentsIsSchedulingEasy,
            appointmentsIsReminderSent,
            appointmentsSchedulingWay
        }

        setIsSubmit(true)
        serverRequest.put(`/v1/patients-surveys/${patientSurveyId}`, patientSurveyData)
        .then(response => {
            setIsSubmit(false)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
            navigate(`/patients-surveys/${patientSurveyId}`)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            if(error?.response?.data?.field === 'arrivalMethodId') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setArrivalMethodError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'overallExperience') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setOverallExperienceError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'waitingTimeWaited') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setWaitingTimeWaitedError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'waitingIsDelayHappened') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setWaitingIsDelayHappenedError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'waitingIsDelayInformed') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setWaitingIsDelayInformedError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'waitingSatisfaction') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setWaitingSatisfactionError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'environmentIsClean') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setEnvironmentIsCleanError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'environmentIsComfortable') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setEnvironmentIsComfortableError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'staffIsFriendly') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setStaffIsFriendlyError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'staffIsResponsive') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setStaffIsResponsiveError(error?.response?.data?.message)
                return
            }
            
            if(error?.response?.data?.field === 'healthcareProviderAttentiveness') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setHealthcareProviderAttentivenessError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'healthcareProviderIsAddressedAdequately') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setHealthcareProviderIsAddressedAdequatelyError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'healthcareProviderTreatmentExplanation') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setHealthcareProviderTreatmentExplanationError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'healthcareProviderIsMedicalHistoryAsked') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setHealthcareProviderIsMedicalHistoryAskedError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'appointmentsIsConvenientTimeSlotFound') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setAppointmentsIsConvenientTimeSlotFoundError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'appointmentsIsSchedulingEasy') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setAppointmentsIsSchedulingEasyError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'appointmentsIsReminderSent') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setAppointmentsIsReminderSentError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'appointmentsSchedulingWay') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setAppointmentsSchedulingWayError(error?.response?.data?.message)
                return
            }

            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })

        })
    }


    return <div>
        <PageHeader 
        pageName={isUpdate ? `Update Patient Survey #${patientSurvey.patientSurveyId}` : `Create Patient Survey For ${patient?.firstName} ${patient?.lastName ? patient.lastName : ''}`}
        isHideRefresh={true}
        />
            <div className="patient-profile-grid-container">
                <div className="patient-profile-page-navigator-container">
                    <ul>
                        <li>
                            <a href="#waiting-section">
                                {'Waiting'}
                            </a>
                        </li>
                        
                        <li>
                            <a href="#environment-section">
                                {'Environment'}
                            </a>
                        </li>
                        <li>
                            <a href="#staff-section">
                                {'Staff'}
                            </a>
                        </li>
                        <li>
                            <a href="#doctor-section">
                                {'Doctor'}
                            </a>
                        </li>
                        <li>
                            <a href="#appointment-section">
                                {'Appointments'}
                            </a>
                        </li>
                        <li>
                            <a href="#arrival-method-section">
                                {'Arrival Method'}
                            </a>
                        </li>
                        <li>
                            <a href="#overall-section">
                                {'Overall Experience'}
                            </a>
                        </li>
                        <li>
                            <a href="#submit-section">
                                {'Submit'}
                            </a>
                        </li>
                    </ul>
                </div>
                {
                    isLoadPatient ?
                    <CircularLoading />
                    :
                    <div>
                        <div className="cards-grey-container">
                            <div className="patient-form-wrapper" id="waiting-section">
                                <div className="patient-form-header">
                                    <h2>
                                        {'Waiting'}
                                    </h2>
                                </div>
                            <div className="cards-2-list-wrapper">
                               <div className="form-input-container">
                                    <label>Waiting Time (minutes)</label>
                                    <input 
                                    type="number" 
                                    className="form-input"
                                    value={waitingTimeWaited}
                                    onClick={e => setWaitingTimeWaitedError()}
                                    onChange={e => setWaitingTimeWaited(e.target.value)}
                                     />
                                    <span className="red">{waitingTimeWaitedError}</span>
                                </div>
                                <div className="form-input-container">
                                    <label>Waiting Satisfaction</label>
                                    <select 
                                    className="form-input"
                                    onClick={e => setWaitingSatisfactionError()}
                                    onChange={e => setWaitingSatisfaction(e.target.value)}
                                    >
                                        <option disabled selected>Choose the waiting satisfaction</option>
                                        {satisfactionRateList.map(rate => {
                                            if(rate.number === waitingSatisfaction) {
                                                return <option selected value={rate.number}>{rate.name}</option> 
                                            }

                                            return <option value={rate.number}>{rate.name}</option>
                                        })}
                                    </select>
                                    <span className="red">{waitingSatisfactionError}</span>
                                </div>
                            </div>
                            <div className="cards-2-list-wrapper margin-top-1">
                                    <div className="form-input-container">
                                        <label>Did any delay happen?</label>
                                        <select 
                                        className="form-input"
                                        onClick={e => setWaitingIsDelayHappenedError()}
                                        onChange={e => setWaitingIsDelayHappened(getTheBooleanValue(e.target.value))}
                                        >
                                            <option disabled selected></option>
                                            {agreementList.map(agreement => {
                                                if(formatValue(waitingIsDelayHappened) === agreement) {
                                                    return <option selected value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                                }
                                                return <option value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                            })}
                                        </select>
                                        <span className="red">{waitingIsDelayHappenedError}</span>
                                    </div>
                                    <div className="form-input-container">
                                        <label>Was the delay informed?</label>
                                        <select 
                                        className="form-input"
                                        onClick={e => setWaitingIsDelayInformedError()}
                                        onChange={e => setWaitingIsDelayInformed(getTheBooleanValue(e.target.value))}
                                        >
                                            <option disabled selected></option>
                                            {agreementList.map(agreement => {
                                                if(formatValue(waitingIsDelayInformed) === agreement) {
                                                    return <option selected value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                                }
                                                return <option value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                            })}
                                        </select>
                                        <span className="red">{waitingIsDelayInformedError}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="cards-grey-container margin-top-1">
                            <div className="patient-form-wrapper" id="environment-section">
                                <div className="patient-form-header">
                                    <h2>
                                        {'Environment'}
                                    </h2>
                                </div>
                            <div className="cards-2-list-wrapper">
                                <div className="form-input-container">
                                    <label>Was the clinic clean?</label>
                                    <select 
                                    className="form-input"
                                    onClick={e => setEnvironmentIsCleanError()}
                                    onChange={e => setEnvironmentIsClean(getTheBooleanValue(e.target.value))}
                                    >
                                        <option disabled selected></option>
                                        {agreementList.map(agreement => {
                                            if(formatValue(environmentIsClean) === agreement) {
                                                return <option selected value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                            }
                                            return <option value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                        })}
                                    </select>
                                    <span className="red">{environmentIsCleanError}</span>
                                </div>
                                <div className="form-input-container">
                                    <label>Was the clinic comfortable?</label>
                                    <select 
                                    className="form-input"
                                    onClick={e => setEnvironmentIsComfortableError()}
                                    onChange={e => setEnvironmentIsComfortable(getTheBooleanValue(e.target.value))}
                                    >
                                        <option disabled selected></option>
                                        {agreementList.map(agreement => {
                                            if(formatValue(environmentIsComfortable) === agreement) {
                                                return <option selected value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                            }
                                            return <option value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                        })}
                                    </select>
                                    <span className="red">{environmentIsComfortableError}</span>
                                </div>
                            </div>
                        </div>
                        </div>

                        <div className="cards-grey-container margin-top-1">
                            <div className="patient-form-wrapper" id="staff-section">
                                <div className="patient-form-header">
                                    <h2>
                                        {'Staff'}
                                    </h2>
                                </div>
                            <div className="cards-2-list-wrapper">
                                <div className="form-input-container">
                                    <label>Was the staff friendly?</label>
                                    <select 
                                    className="form-input"
                                    onClick={e => setStaffIsFriendlyError()}
                                    onChange={e => setStaffIsFriendly(getTheBooleanValue(e.target.value))}
                                    >
                                        <option disabled selected></option>
                                        {agreementList.map(agreement => {
                                            if(formatValue(staffIsFriendly) === agreement) {
                                                return <option selected value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                            }
                                            return <option value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                        })}
                                    </select>
                                    <span className="red">{staffIsFriendlyError}</span>
                                </div>
                                <div className="form-input-container">
                                    <label>Was the staff responsive?</label>
                                    <select 
                                    className="form-input"
                                    onClick={e => setStaffIsResponsiveError()}
                                    onChange={e => setStaffIsResponsive(getTheBooleanValue(e.target.value))}
                                    >
                                        <option disabled selected></option>
                                        {agreementList.map(agreement => {
                                            if(formatValue(staffIsResponsive) === agreement) {
                                                return <option selected value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                            }
                                            return <option value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                        })}
                                    </select>
                                    <span className="red">{staffIsResponsiveError}</span>
                                </div>
                            </div>
                        </div>
                        </div>

                        <div className="cards-grey-container margin-top-1">
                            <div className="patient-form-wrapper" id="doctor-section">
                                <div className="patient-form-header">
                                    <h2>
                                        {'Doctor'}
                                    </h2>
                                </div>
                            <div className="cards-2-list-wrapper">
                                <div className="form-input-container">
                                    <label>Doctor attention?</label>
                                    <select 
                                    className="form-input"
                                    onClick={e => setHealthcareProviderAttentivenessError()}
                                    onChange={e => setHealthcareProviderAttentiveness(e.target.value)}
                                    >
                                        <option disabled selected></option>
                                        {experienceRateList.map(rate => {
                                            if(rate.number === healthcareProviderAttentiveness) {
                                                return <option selected value={rate.number}>{capitalizeFirstLetter(rate.name)}</option> 
                                            }

                                            return <option value={rate.number}>{capitalizeFirstLetter(rate.name)}</option>
                                        })}
                                    </select>
                                    <span className="red">{healthcareProviderAttentivenessError}</span>
                                </div>
                                <div className="form-input-container">
                                    <label>Is issues addressed adequatly?</label>
                                    <select 
                                    className="form-input"
                                    onClick={e => setHealthcareProviderIsAddressedAdequatelyError()}
                                    onChange={e => setHealthcareProviderIsAddressedAdequately(getTheBooleanValue(e.target.value))}
                                    >
                                        <option disabled selected></option>
                                        {agreementList.map(agreement => {
                                            if(formatValue(healthcareProviderIsAddressedAdequately) === agreement) {
                                                return <option selected value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                            }
                                            return <option value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                        })}
                                    </select>
                                    <span className="red">{healthcareProviderIsAddressedAdequatelyError}</span>
                                </div>
                                
                            </div>
                            <div className="cards-2-list-wrapper margin-top-1">
                                <div className="form-input-container">
                                    <label>Is treatment explained clearly?</label>
                                    <select 
                                    className="form-input"
                                    onClick={e => setHealthcareProviderTreatmentExplanationError()}
                                    onChange={e => setHealthcareProviderTreatmentExplanation(e.target.value)}
                                    >
                                        <option disabled selected></option>
                                        {explanationRateList.map(rate => {
                                            if(rate.number === healthcareProviderTreatmentExplanation) {
                                                return <option selected value={rate.number}>{capitalizeFirstLetter(rate.name)}</option> 
                                            }

                                            return <option value={rate.number}>{capitalizeFirstLetter(rate.name)}</option>
                                        })}
                                    </select>
                                    <span className="red">{healthcareProviderTreatmentExplanationError}</span>
                                </div>
                                <div className="form-input-container">
                                    <label>Is medical history asked?</label>
                                    <select 
                                    className="form-input"
                                    onClick={e => setHealthcareProviderIsMedicalHistoryAskedError()}
                                    onChange={e => setHealthcareProviderIsMedicalHistoryAsked(getTheBooleanValue(e.target.value))}
                                    >
                                        <option disabled selected></option>
                                        {agreementList.map(agreement => {
                                            if(formatValue(healthcareProviderIsMedicalHistoryAsked) === agreement) {
                                                return <option selected value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                            }
                                            return <option value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                        })}
                                    </select>
                                    <span className="red">{healthcareProviderIsMedicalHistoryAskedError}</span>
                                </div>
                                
                            </div>
                        </div>
                        </div>

                        <div className="cards-grey-container margin-top-1">
                            <div className="patient-form-wrapper" id="appointment-section">
                                <div className="patient-form-header">
                                    <h2>
                                        {'Appointment'}
                                    </h2>
                                </div>
                            <div className="cards-2-list-wrapper">
                            <div className="form-input-container">
                                <label>Is convenient time slot found?</label>
                                    <select 
                                    className="form-input"
                                    onClick={e => setAppointmentsIsConvenientTimeSlotFoundError()}
                                    onChange={e => setAppointmentsIsConvenientTimeSlotFound(getTheBooleanValue(e.target.value))}
                                    >
                                        <option disabled selected></option>
                                        {agreementList.map(agreement => {
                                            if(formatValue(appointmentsIsConvenientTimeSlotFound) === agreement) {
                                                return <option selected value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                            }
                                            return <option value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                        })}
                                    </select>
                                    <span className="red">{appointmentsIsConvenientTimeSlotFoundError}</span>
                                </div>
                                <div className="form-input-container">
                                    <label>Is scheduling easy?</label>
                                    <select 
                                    className="form-input"
                                    onClick={e => setAppointmentsIsSchedulingEasyError()}
                                    onChange={e => setAppointmentsIsSchedulingEasy(getTheBooleanValue(e.target.value))}
                                    >
                                       <option disabled selected></option>
                                        {agreementList.map(agreement => {
                                            if(formatValue(appointmentsIsSchedulingEasy) === agreement) {
                                                return <option selected value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                            }
                                            return <option value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                        })}
                                    </select>
                                    <span className="red">{appointmentsIsSchedulingEasyError}</span>
                                </div>
                                
                            </div>
                            <div className="cards-2-list-wrapper margin-top-1">
                                <div className="form-input-container">
                                    <label>Is reminder sent?</label>
                                    <select 
                                    className="form-input"
                                    onClick={e => setAppointmentsIsReminderSentError()}
                                    onChange={e => setAppointmentsIsReminderSent(getTheBooleanValue(e.target.value))}
                                    >
                                        <option disabled selected></option>
                                        {agreementList.map(agreement => {
                                            if(formatValue(appointmentsIsReminderSent) === agreement) {
                                                return <option selected value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                            }
                                            return <option value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                        })}
                                    </select>
                                    <span className="red">{appointmentsIsReminderSentError}</span>
                                </div>
                                <div className="form-input-container">
                                    <label>Scheduling way?</label>
                                    <select 
                                    className="form-input"
                                    onClick={e => setAppointmentsSchedulingWayError()}
                                    onChange={e => setAppointmentsSchedulingWay(e.target.value)}
                                    >
                                        <option disabled selected></option>
                                        {schedulingWays.map(way => {
                                            if(way === appointmentsSchedulingWay) {
                                                return <option selected value={way}>{capitalizeFirstLetter(way)}</option>
                                            }
                                            return <option value={way}>{capitalizeFirstLetter(way)}</option>
                                        })}
                                    </select>
                                    <span className="red">{appointmentsSchedulingWayError}</span>
                                </div>
                                
                            </div>
                        </div>
                        </div>

                            <div className="cards-grey-container margin-top-1">
                                <div className="patient-form-wrapper" id="arrival-method-section">
                                    <div className="patient-form-header">
                                        <h2>
                                            Arrival Method
                                        </h2>
                                    </div>
                                <div className="cards-2-list-wrapper">
                                    <div className="form-input-container">
                                        <label>How did you hear about the clinic?</label>
                                            <select 
                                            className="form-input"
                                            onClick={e => setArrivalMethodError()}
                                            onChange={e => setArrivalMethod(e.target.value)}
                                            >
                                                <option selected disabled></option>
                                            {arrivalMethods.map(method => {

                                                if(method._id === arrivalMethod) {
                                                    return <option selected value={method._id}>{method.name}</option> 
                                                }
                                                    return <option value={method._id}>{method.name}</option>
                                                })}
                                            </select>
                                            <span className="red">{arrivalMethodError}</span>
                                    </div>
                                </div>
                            
                            </div>
                            </div>

                        <div className="cards-grey-container margin-top-1">
                            <div className="patient-form-wrapper" id="overall-section">
                                <div className="patient-form-header">
                                    <h2>
                                        Overall Experience & Call
                                    </h2>
                                </div>
                            <div className="cards-2-list-wrapper">
                                <div className="form-input-container">
                                    <label>What is the overall experience?</label>
                                        <select 
                                        className="form-input"
                                        onClick={e => setOverallExperienceError()}
                                        onChange={e => setOverallExperience(e.target.value)}
                                        >
                                            <option selected disabled></option>
                                        {experienceRateList.map(rate => {
                                                if(rate.number === overallExperience) {
                                                    return <option selected value={rate.number}>{capitalizeFirstLetter(rate.name)}</option>
                                                }
                                                return <option value={rate.number}>{capitalizeFirstLetter(rate.name)}</option>
                                            })}
                                        </select>
                                        <span className="red">{overallExperienceError}</span>
                                </div>
                                <div className="form-input-container">
                                    <label>Call Duration (minutes)</label>
                                    <input 
                                    type="number"
                                    className="form-input"
                                    value={callDuration}
                                    onClick={e => setCallDurationError()}
                                    onChange={e => setCallDuration(e.target.value)}
                                    />
                                    <span className="red">{callDurationError}</span>
                                </div>
                            </div>
                           
                        </div>
                        </div>

                        <div className="margin-top-1"></div>
                        <div className="form-buttons-container" id="submit-section">
                            {
                                isSubmit ?
                                <TailSpin width="25" height="25" color="#4c83ee" />
                                :
                                <button 
                                form="patient-form"
                                onClick={e => isUpdate ? handleUpdate() : handleSubmit()}
                                className="normal-button white-text action-color-bg"
                                >{isUpdate ? translations[lang]['Update'] : translations[lang]['Create']}</button>
                            }
                            <button 
                            className="normal-button cancel-button"
                            onClick={e => {
                                setShowModalForm(false)
                            }}
                            >{translations[lang]['Close']}</button>
                            </div>
                            <div className="margin-top-1"></div>
                    </div>
                }
                
            </div>        
            </div>
}

export default PatientFormPage