import { useState, useEffect } from "react"
import '../patients.css'
import { TailSpin } from "react-loader-spinner"
import { serverRequest } from "../../components/API/request"
import { toast } from "react-hot-toast"
import PageHeader from "../../components/sections/page-header"
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux"
import { isRolesValid } from "../../utils/roles"
import translations from "../../i18n"
import { useSearchParams } from 'react-router-dom'
import CircularLoading from "../../components/loadings/circular"
import { experienceRateList, explanationRateList, satisfactionRateList } from '../../utils/experience-translator'
import { capitalizeFirstLetter } from "../../utils/formatString"
import { healthImprovementRateList } from "../../utils/experience-translator"
import CancelIcon from '@mui/icons-material/Cancel'


const TreatmentSurveyFormPage = ({ roles }) => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const clinicId = pagePath.split('/')[2]
    const patientId = pagePath.split('/')[4]
    const treatmentSurveyId = pagePath.split('/')[2]

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [searchParams, setSearchParams] = useSearchParams()
    const mode = searchParams.get('mode')

    const [patient, setPatient] = useState({})
    const [treatmentSurvey, setTreatmentSurvey] = useState({})

    const [isUpdate, setIsUpdate] = useState(mode === 'UPDATE' ? true : false)
    const [isLoadPatient, setIsLoadPatient] = useState(mode === 'UPDATE' ? true : false)

    const [isSubmit, setIsSubmit] = useState(false)

    const [takingMedicationChallenges, setTakingMedicationChallenges] = useState([])
    const [obtainingMedicationChallenges, setObtainingMedicationChallenges] = useState([])

    const [newSideEffect, setNewSideEffect] = useState()
    const [newSymptom, setNewSymptom] = useState()
    
    const [callDuration, setCallDuration] = useState()
    const [improvement, setImprovement] = useState()
    const [isOverallHealthChanged, setIsOverallHealthChanged] = useState()
    const [isExperiencedSideEffects, setIsExperiencedSideEffects] = useState()
    const [experiencedSideEffects, setExperiencedSideEffects] = useState([])
    const [isMedicationTookAsPrescribed, setIsMedicationTookAsPrescribed] = useState()
    const [isDosagesMissed, setIsDosagesMissed] = useState()
    const [isTakingOtherOutterMedication, setIsTakingOtherOutterMedication] = useState()
    const [isThereChallengesObtainingMedication, setIsThereChallengesObtainingMedication] = useState()
    const [challengesObtainingMedication, setChallengesObtainingMedication] = useState([])
    const [isThereChallengesTakingMedication, setIsThereChallengesTakingMedication] = useState()
    const [challengesTakingMedication, setChallengesTakingMedication] = useState([])
    const [isThereProblemRemebering, setIsThereProblemRemebering] = useState()
    const [isNewSymptomsOccured, setIsNewSymptomsOccured] = useState()
    const [newSymptomsOccured, setNewSymptomsOccured] = useState([])

    const [callDurationError, setCallDurationError] = useState()
    const [improvementError, setImprovementError] = useState()
    const [isOverallHealthChangedError, setIsOverallHealthChangedError] = useState()
    const [isExperiencedSideEffectsError, setIsExperiencedSideEffectsError] = useState()
    const [experiencedSideEffectsError, setExperiencedSideEffectsError] = useState([])
    const [isMedicationTookAsPrescribedError, setIsMedicationTookAsPrescribedError] = useState()
    const [isDosagesMissedError, setIsDosagesMissedError] = useState()
    const [isTakingOtherOutterMedicationError, setIsTakingOtherOutterMedicationError] = useState()
    const [isThereChallengesObtainingMedicationError, setIsThereChallengesObtainingMedicationError] = useState()
    const [challengesObtainingMedicationError, setChallengesObtainingMedicationError] = useState([])
    const [isThereChallengesTakingMedicationError, setIsThereChallengesTakingMedicationError] = useState()
    const [challengesTakingMedicationError, setChallengesTakingMedicationError] = useState([])
    const [isThereProblemRemeberingError, setIsThereProblemRemeberingError] = useState()
    const [isNewSymptomsOccuredError, setIsNewSymptomsOccuredError] = useState()
    const [newSymptomsOccuredError, setNewSymptomsOccuredError] = useState([])
    

    const agreementList = ['YES', 'NO']

    useEffect(() => {
        //isRolesValid(user.roles, roles) ? null : navigate('/login')
        scroll(0, 0)
    }, [])

    useEffect(() => {
        serverRequest.get('/v1/medication-challenges')
        .then(response => {
            const medicationChallenges = response.data.medicationChallenges
            setTakingMedicationChallenges(medicationChallenges.filter(challenge => challenge.category === 'TAKE'))
            setObtainingMedicationChallenges(medicationChallenges.filter(challenge => challenge.category === 'OBTAIN'))
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })

    }, [])

    useEffect(() => {

        if(!isUpdate) {
            return
        }

        setIsLoadPatient(true)
        serverRequest.get(`/v1/treatments-surveys/${treatmentSurveyId}`)
        .then(response => {
            setIsLoadPatient(false)

            const treatmentSurvey = response.data.treatmentSurvey

            setTreatmentSurvey(treatmentSurvey)

            setCallDuration(treatmentSurvey?.callDuration)
            setImprovement(treatmentSurvey?.improvement)
            setIsOverallHealthChanged(treatmentSurvey?.isOverallHealthChanged)
            setIsExperiencedSideEffects(treatmentSurvey?.isExperiencedSideEffects)
            setExperiencedSideEffects(treatmentSurvey?.experiencedSideEffects)
            setIsMedicationTookAsPrescribed(treatmentSurvey?.isMedicationTookAsPrescribed)
            setIsDosagesMissed(treatmentSurvey?.isDosagesMissed)
            setIsTakingOtherOutterMedication(treatmentSurvey?.isTakingOtherOutterMedication)
            setIsThereChallengesObtainingMedication(treatmentSurvey?.isThereChallengesObtainingMedication)
            setChallengesObtainingMedication(treatmentSurvey?.challengesObtainingMedication)
            setIsThereChallengesTakingMedication(treatmentSurvey?.isThereChallengesTakingMedication)
            setChallengesTakingMedication(treatmentSurvey?.challengesTakingMedication)
            setIsThereProblemRemebering(treatmentSurvey?.isThereProblemRemebering)
            setIsNewSymptomsOccured(treatmentSurvey?.isNewSymptomsOccured)
            setNewSymptomsOccured(treatmentSurvey?.newSymptomsOccured)
            
        })
        .catch(error => {
            setIsLoadPatient(false)
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

    const formatValue = (value) => {

        if(typeof value !== 'boolean') {
            return 'Not Registered'
        } else if(value === true) {
            return 'YES'
        } else if(value === false) {
            return 'NO'
        }
    }

    const getObtainMedicationReason = (id) => {

        for(let i=0;i<challengesObtainingMedication.length;i++) {
            if(id === challengesObtainingMedication[i]._id) {
                return
            }
        }

        for(let i=0;i<obtainingMedicationChallenges.length;i++) {
            if(id === obtainingMedicationChallenges[i]._id) {
                setChallengesObtainingMedication([...challengesObtainingMedication, obtainingMedicationChallenges[i]])
                return
            }
        }
    }

    const getTakeMedicationReason = (id) => {

        for(let i=0;i<challengesTakingMedication.length;i++) {
            if(id === challengesTakingMedication[i]._id) {
                return
            }
        }

        for(let i=0;i<takingMedicationChallenges.length;i++) {
            if(id === takingMedicationChallenges[i]._id) {
                setChallengesTakingMedication([...challengesTakingMedication, takingMedicationChallenges[i]])
                return
            }
        }
    }

    const handleSubmit = () => {

        const treatmentSurveyData = {
            clinicId,
            doneById: user._id,
            patientId,
            callDuration: Number.parseInt(callDuration),
            improvement: Number.parseInt(improvement),
            isOverallHealthChanged,
            isExperiencedSideEffects,
            experiencedSideEffects,
            isMedicationTookAsPrescribed,
            isDosagesMissed,
            isTakingOtherOutterMedication,
            isThereChallengesObtainingMedication,
            challengesObtainingMedication: challengesObtainingMedication.map(challenge => challenge._id),
            isThereChallengesTakingMedication,
            challengesTakingMedication: challengesTakingMedication.map(challenge => challenge._id),
            isThereProblemRemebering,
            isNewSymptomsOccured,
            newSymptomsOccured, 
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/treatments-surveys`, treatmentSurveyData)
        .then(response => {
            setIsSubmit(false)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
            navigate('/treatments-surveys')

        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            if(error?.response?.data?.field === 'callDuration') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setCallDurationError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'improvement') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setImprovementError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'isOverallHealthChanged') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setIsOverallHealthChangedError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'isExperiencedSideEffects') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setIsExperiencedSideEffectsError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'experiencedSideEffects') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setExperiencedSideEffectsError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'isMedicationTookAsPrescribed') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setIsMedicationTookAsPrescribedError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'isDosagesMissed') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setIsDosagesMissedError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'isTakingOtherOutterMedication') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setIsTakingOtherOutterMedicationError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'isThereChallengesObtainingMedication') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setIsThereChallengesObtainingMedicationError(error?.response?.data?.message)
                return
            }
            
            if(error?.response?.data?.field === 'challengesObtainingMedication') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setChallengesObtainingMedicationError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'isThereChallengesTakingMedication') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setIsThereChallengesTakingMedicationError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'challengesTakingMedication') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setChallengesTakingMedicationError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'isThereProblemRemebering') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setIsThereProblemRemeberingError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'isNewSymptomsOccured') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setIsNewSymptomsOccuredError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'newSymptomsOccured') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setNewSymptomsOccuredError(error?.response?.data?.message)
                return
            }

            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })

        })
    }

    const handleUpdate = () => {

        const treatmentSurveyData = {
            callDuration: Number.parseInt(callDuration),
            improvement: Number.parseInt(improvement),
            isOverallHealthChanged,
            isExperiencedSideEffects,
            experiencedSideEffects,
            isMedicationTookAsPrescribed,
            isDosagesMissed,
            isTakingOtherOutterMedication,
            isThereChallengesObtainingMedication,
            challengesObtainingMedication: challengesObtainingMedication.map(challenge => challenge._id),
            isThereChallengesTakingMedication,
            challengesTakingMedication: challengesTakingMedication.map(challenge => challenge._id),
            isThereProblemRemebering,
            isNewSymptomsOccured,
            newSymptomsOccured, 
        }

        setIsSubmit(true)
        serverRequest.put(`/v1/treatments-surveys/${treatmentSurveyId}`, treatmentSurveyData)
        .then(response => {
            setIsSubmit(false)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
            navigate(`/treatments-surveys/${treatmentSurveyId}`)

        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            if(error?.response?.data?.field === 'callDuration') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setCallDurationError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'improvement') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setImprovementError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'isOverallHealthChanged') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setIsOverallHealthChangedError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'isExperiencedSideEffects') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setIsExperiencedSideEffectsError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'experiencedSideEffects') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setExperiencedSideEffectsError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'isMedicationTookAsPrescribed') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setIsMedicationTookAsPrescribedError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'isDosagesMissed') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setIsDosagesMissedError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'isTakingOtherOutterMedication') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setIsTakingOtherOutterMedicationError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'isThereChallengesObtainingMedication') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setIsThereChallengesObtainingMedicationError(error?.response?.data?.message)
                return
            }
            
            if(error?.response?.data?.field === 'challengesObtainingMedication') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setChallengesObtainingMedicationError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'isThereChallengesTakingMedication') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setIsThereChallengesTakingMedicationError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'challengesTakingMedication') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setChallengesTakingMedicationError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'isThereProblemRemebering') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setIsThereProblemRemeberingError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'isNewSymptomsOccured') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setIsNewSymptomsOccuredError(error?.response?.data?.message)
                return
            }

            if(error?.response?.data?.field === 'newSymptomsOccured') {
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
                setNewSymptomsOccuredError(error?.response?.data?.message)
                return
            }

            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })

        })
    }


    return <div>
        <PageHeader 
        pageName={isUpdate ? `Update Treatment Survey #${treatmentSurvey.treatmentSurveyId}` : `Create Treatment Survey For ${patient?.firstName} ${patient?.lastName ? patient.lastName : ''}`}
        isHideRefresh={true}
        />
            <div className="patient-profile-grid-container">
                <div className="patient-profile-page-navigator-container">
                    <ul>
                        <li>
                            <a href="#health-section">
                                {'Health Improvement'}
                            </a>
                        </li>
                        
                        <li>
                            <a href="#side-effects-section">
                                {'Side Effects & Symptoms'}
                            </a>
                        </li>
                        <li>
                            <a href="#medication-section">
                                {'Medication & Dosages'}
                            </a>
                        </li>
                        <li>
                            <a href="#call-section">
                                {'Call'}
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
                            <div className="patient-form-wrapper" id="health-section">
                                <div className="patient-form-header">
                                    <h2>
                                        {'Health Improvement'}
                                    </h2>
                                </div>
                            <div className="cards-2-list-wrapper">
                               <div className="form-input-container">
                                    <label>Improvement</label>
                                    <select
                                    className="form-input"
                                    onClick={e => setImprovementError()}
                                    onChange={e => setImprovement(e.target.value)}
                                     >
                                        <option selected disabled></option>
                                     {healthImprovementRateList.map(health => {

                                        if(health.number === improvement) {
                                            return <option selected value={health.number}>{capitalizeFirstLetter(health.name)}</option>
                                        }

                                        return <option value={health.number}>{capitalizeFirstLetter(health.name)}</option>
                                     })}
                                     </select>
                                    <span className="red">{improvementError}</span>
                                </div>
                                <div className="form-input-container">
                                    <label>Did the overall health change?</label>
                                    <select 
                                    className="form-input"
                                    onClick={e => setIsOverallHealthChangedError()}
                                    onChange={e => setIsOverallHealthChanged(getTheBooleanValue(e.target.value))}
                                    >
                                        <option disabled selected></option>
                                        {agreementList.map(agree => {
                                            if(formatValue(isOverallHealthChanged) === agree) {
                                                return <option selected value={agree}>{capitalizeFirstLetter(agree)}</option> 
                                            }

                                            return <option value={agree}>{capitalizeFirstLetter(agree)}</option>
                                        })}
                                    </select>
                                    <span className="red">{isOverallHealthChangedError}</span>
                                </div>
                            </div>
                            
                            </div>
                        </div>
                        
                        <div className="cards-grey-container margin-top-1">
                            <div className="patient-form-wrapper" id="side-effects-section">
                                <div className="patient-form-header">
                                    <h2>
                                        {'Side Effects & New Symptoms'}
                                    </h2>
                                </div>
                            <div className="cards-2-list-wrapper">
                                <div className="form-input-container">
                                    <label>Is there any side effects?</label>
                                    <select 
                                    className="form-input"
                                    onClick={e => setIsExperiencedSideEffectsError()}
                                    onChange={e => setIsExperiencedSideEffects(getTheBooleanValue(e.target.value))}
                                    >
                                        <option disabled selected></option>
                                        {agreementList.map(agreement => {
                                            if(formatValue(isExperiencedSideEffects) === agreement) {
                                                return <option selected value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                            }
                                            return <option value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                        })}
                                    </select>
                                    <span className="red">{isExperiencedSideEffectsError}</span>
                                </div>
                                <div className="form-input-container">
                                    <label>Experienced Side Effects</label>
                                    <input 
                                    type="text"
                                    className="form-input"
                                    value={newSideEffect}
                                    onClick={e => setExperiencedSideEffectsError()}
                                    onChange={e => setNewSideEffect(e.target.value)}
                                    />
                                    <span className="red">{experiencedSideEffectsError}</span>
                                    <div className="padding-top-bottom right">
                                        <button 
                                    className="normal-button action-color-bg white-text"
                                    onClick={e => {
                                        if(!newSideEffect) return setExperiencedSideEffectsError('no side effect is added')
                                        if(!newSideEffect.trim()) return
                                        setExperiencedSideEffects([...experiencedSideEffects, newSideEffect])
                                        setNewSideEffect('')
                                    }}
                                    >
                                        Add
                                        </button>
                                    </div>
                                    <div className="symptoms-diagnosis-tags-container">
                                        <div className="drug-instruction-list-container">
                                            {experiencedSideEffects.map((sideEffect, index) => <span 
                                            className="status-btn pending"
                                            >
                                                {sideEffect}
                                                <span 
                                                onClick={e => setExperiencedSideEffects(experiencedSideEffects.filter((sideEffect, savedIndex) => savedIndex !== index))}>
                                                    <CancelIcon />
                                                </span>
                                            </span>) 
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="cards-2-list-wrapper margin-top-1">
                                <div className="form-input-container">
                                    <label>Is there any new symptoms?</label>
                                    <select 
                                    className="form-input"
                                    onClick={e => setIsNewSymptomsOccuredError()}
                                    onChange={e => setIsNewSymptomsOccured(getTheBooleanValue(e.target.value))}
                                    >
                                        <option disabled selected></option>
                                        {agreementList.map(agreement => {
                                            if(formatValue(isNewSymptomsOccured) === agreement) {
                                                return <option selected value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                            }
                                            return <option value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                        })}
                                    </select>
                                    <span className="red">{isNewSymptomsOccuredError}</span>
                                </div>
                                <div className="form-input-container">
                                    <label>New Symptoms</label>
                                    <input 
                                    type="text"
                                    className="form-input"
                                    value={newSymptom}
                                    onClick={e => setNewSymptomsOccuredError()}
                                    onChange={e => setNewSymptom(e.target.value)}
                                    />
                                    <span className="red">{newSymptomsOccuredError}</span>
                                    <div className="padding-top-bottom right">
                                    <button 
                                    className="normal-button action-color-bg white-text"
                                    onClick={e => {
                                        if(!newSymptom) return setNewSymptomsOccuredError('no symptom is added')
                                        if(!newSymptom.trim()) return
                                        setNewSymptomsOccured([...newSymptomsOccured, newSymptom])
                                        setNewSymptom('')
                                    }}
                                    >
                                    Add
                                    </button>
                                    </div>
                                    <div className="symptoms-diagnosis-tags-container">
                                        <div className="drug-instruction-list-container">
                                            {newSymptomsOccured.map((symptom, index) => <span 
                                            className="status-btn pending"
                                            >
                                                {symptom}
                                                <span 
                                                onClick={e => setNewSymptomsOccured(newSymptomsOccured.filter((symptom, savedIndex) => savedIndex !== index))}>
                                                    <CancelIcon />
                                                </span>
                                            </span>) 
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>

                        <div className="cards-grey-container margin-top-1">
                            <div className="patient-form-wrapper" id="medication-section">
                                <div className="patient-form-header">
                                    <h2>
                                        {'Medication'}
                                    </h2>
                                </div>
                            <div className="cards-2-list-wrapper">
                                <div className="form-input-container">
                                    <label>Is the medication took as prescribed?</label>
                                    <select 
                                    className="form-input"
                                    onClick={e => setIsMedicationTookAsPrescribedError()}
                                    onChange={e => setIsMedicationTookAsPrescribed(getTheBooleanValue(e.target.value))}
                                    >
                                        <option disabled selected></option>
                                        {agreementList.map(agreement => {
                                            if(formatValue(isMedicationTookAsPrescribed) === agreement) {
                                                return <option selected value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                            }
                                            return <option value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                        })}
                                    </select>
                                    <span className="red">{isMedicationTookAsPrescribedError}</span>
                                </div>
                                <div className="form-input-container">
                                    <label>Is any dosage missed?</label>
                                    <select 
                                    className="form-input"
                                    onClick={e => setIsDosagesMissedError()}
                                    onChange={e => setIsDosagesMissed(getTheBooleanValue(e.target.value))}
                                    >
                                        <option disabled selected></option>
                                        {agreementList.map(agreement => {
                                            if(formatValue(isDosagesMissed) === agreement) {
                                                return <option selected value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                            }
                                            return <option value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                        })}
                                    </select>
                                    <span className="red">{isDosagesMissedError}</span>
                                </div>
                            </div>
                            <div className="cards-2-list-wrapper margin-top-1">
                                <div className="form-input-container">
                                    <label>Is there any challenges obtaining medication?</label>
                                    <select 
                                    className="form-input"
                                    onClick={e => setIsThereChallengesObtainingMedicationError()}
                                    onChange={e => setIsThereChallengesObtainingMedication(getTheBooleanValue(e.target.value))}
                                    >
                                        <option disabled selected></option>
                                        {agreementList.map(agreement => {
                                            if(formatValue(isThereChallengesObtainingMedication) === agreement) {
                                                return <option selected value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                            }
                                            return <option value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                        })}
                                    </select>
                                    <span className="red">{isThereChallengesObtainingMedicationError}</span>
                                </div>
                                <div className="form-input-container">
                                    <label>Challenges Obtaining Medication</label>
                                    <select 
                                    className="form-input"
                                    onClick={e => setChallengesObtainingMedicationError()}
                                    onChange={e => getObtainMedicationReason(e.target.value)}
                                    >
                                        <option selected disabled></option>
                                        {obtainingMedicationChallenges.map(challenge => {
                                            return <option value={challenge._id}>{challenge.name}</option>
                                        })}
                                    </select>
                                    <span className="red">{challengesObtainingMedicationError}</span>
                                    <div className="symptoms-diagnosis-tags-container">
                                        <div className="drug-instruction-list-container">
                                            {challengesObtainingMedication.map((challenge, index) => <span 
                                            className="status-btn pending"
                                            >
                                                {challenge.name}
                                                <span 
                                                onClick={e => setChallengesObtainingMedication(challengesObtainingMedication.filter((challenge, savedIndex) => savedIndex !== index))}>
                                                    <CancelIcon />
                                                </span>
                                            </span>) 
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="cards-2-list-wrapper margin-top-1">
                                <div className="form-input-container">
                                    <label>Is there any challenges taking medication?</label>
                                    <select 
                                    className="form-input"
                                    onClick={e => setIsThereChallengesTakingMedicationError()}
                                    onChange={e => setIsThereChallengesTakingMedication(getTheBooleanValue(e.target.value))}
                                    >
                                        <option disabled selected></option>
                                        {agreementList.map(agreement => {
                                            if(formatValue(isThereChallengesTakingMedication) === agreement) {
                                                return <option selected value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                            }
                                            return <option value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                        })}
                                    </select>
                                    <span className="red">{isThereChallengesTakingMedicationError}</span>
                                </div>
                                <div className="form-input-container">
                                    <label>Challenges taking medication</label>
                                    <select 
                                    className="form-input"
                                    onClick={e => setChallengesTakingMedicationError()}
                                    onChange={e => getTakeMedicationReason(e.target.value)}
                                    >
                                        <option selected disabled></option>
                                        {takingMedicationChallenges.map(challenge => {
                                            return <option value={challenge._id}>{challenge.name}</option>
                                        })}
                                    </select>
                                    <span className="red">{challengesTakingMedicationError}</span>
                                    <div className="symptoms-diagnosis-tags-container">
                                        <div className="drug-instruction-list-container">
                                            {challengesTakingMedication.map((challenge, index) => <span 
                                            className="status-btn pending"
                                            >
                                                {challenge.name}
                                                <span 
                                                onClick={e => setChallengesTakingMedication(challengesTakingMedication.filter((challenge, savedIndex) => savedIndex !== index))}>
                                                    <CancelIcon />
                                                </span>
                                            </span>) 
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="cards-2-list-wrapper margin-top-1">
                                <div className="form-input-container">
                                    <label>Is there problem remebering?</label>
                                    <select 
                                    className="form-input"
                                    onClick={e => setIsThereProblemRemeberingError()}
                                    onChange={e => setIsThereProblemRemebering(getTheBooleanValue(e.target.value))}
                                    >
                                        <option disabled selected></option>
                                        {agreementList.map(agreement => {
                                            if(formatValue(isThereProblemRemebering) === agreement) {
                                                return <option selected value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                            }
                                            return <option value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                        })}
                                    </select>
                                    <span className="red">{isThereProblemRemeberingError}</span>
                                </div>
                                <div className="form-input-container">
                                    <label>Is there outter medication?</label>
                                    <select 
                                    className="form-input"
                                    onClick={e => setIsTakingOtherOutterMedicationError()}
                                    onChange={e => setIsTakingOtherOutterMedication(getTheBooleanValue(e.target.value))}
                                    >
                                        <option disabled selected></option>
                                        {agreementList.map(agreement => {
                                            if(formatValue(isTakingOtherOutterMedication) === agreement) {
                                                return <option selected value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                            }
                                            return <option value={agreement}>{capitalizeFirstLetter(agreement)}</option>
                                        })}
                                    </select>
                                    <span className="red">{isTakingOtherOutterMedicationError}</span>
                                </div>
                            </div>
                        </div>
                        </div>

                        <div className="cards-grey-container margin-top-1">
                            <div className="patient-form-wrapper" id="call-section">
                                <div className="patient-form-header">
                                    <h2>
                                        Call
                                    </h2>
                                </div>
                            <div className="cards-2-list-wrapper">
                               
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

export default TreatmentSurveyFormPage