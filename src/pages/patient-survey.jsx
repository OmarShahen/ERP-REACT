import { useState, useEffect } from 'react'
import './patient-medical.css'
import { serverRequest } from './../components/API/request'
import CircularLoading from './../components/loadings/circular'
import { useSelector } from 'react-redux'
import PageHeader from '../components/sections/page-header'
import { capitalizeFirstLetter } from '../utils/formatString'
import { getAge } from '../utils/age-calculator'
import { getExperienceNameByNumber, getExplanationNameByNumber, getSatisfactionNameByNumber } from '../utils/experience-translator'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { formatNumber } from '../utils/numbers'

const PatientSurveyPage = ({ roles }) => {

    const pagePath = window.location.pathname
    const patientSurveyId = pagePath.split('/')[2]

    const [isLoading, setIsLoading] = useState(true)
    const [patientSurvey, setPatientSurvey] = useState({})

    const [reload, setReload] = useState(1)

    useEffect(() => { 
        //scroll(0, 0) 
        //isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])
    
    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/patients-surveys/${patientSurveyId}`)
        .then(response => {
            setIsLoading(false)
            const data = response.data
            setPatientSurvey(data.patientSurvey)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload])


    return <div>
        <PageHeader
        pageName={`Patient Survey #${patientSurvey?.patientSurveyId}`}
        addBtnText={'Update Survey'}
        addBtnTextIcon={<CreateOutlinedIcon />}
        setReload={setReload}
        reload={reload}
        formURL={`/patients-surveys/${patientSurveyId}/patient-survey/form?mode=UPDATE`}
        />
        <div>
            <div>
                {
                    isLoading ?
                    <CircularLoading />
                    :
                    <div className="patient-profile-grid-container"> 
                        <div className="patient-profile-page-navigator-container">
                            <ul>
                                <li>
                                    <a href="#overview-section">
                                        Overview
                                    </a>
                                </li>
                                <li>
                                    <a href="#patient-section">
                                        Patient
                                    </a>
                                </li>
                                <li>
                                    <a href="#waiting-section">
                                        Waiting
                                    </a>
                                </li>
                                
                                <li>
                                    <a href="#environment-section">
                                        Environment
                                    </a>
                                </li>
                                <li>
                                    <a href="#staff-section">
                                        Staff
                                    </a>
                                </li>
                                <li>
                                    <a href="#doctor-section">
                                        Doctor
                                    </a>
                                </li>
                                <li>
                                    <a href="#appointment-section">
                                        Appointments
                                    </a>
                                </li>
                            </ul>
                        </div>
                        
                    <div className="cards-grey-container">
                    <div className="information-list-container" id="overview-section">
                            <div className="information-list-header">
                                <div className="">
                                    <h2 className="subheader-text">
                                        Overview
                                    </h2>
                                </div>
                            </div>
                            <ul className="body-text">
                            <li>
                                <div className="bold-text">
                                    Clinic
                                </div>
                                <div>
                                    {patientSurvey?.clinic?.name}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Patient
                                </div>
                                <div>
                                    {`${patientSurvey?.patient?.firstName} ${patientSurvey?.patient?.lastName}`}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Done By
                                </div>
                                <div>
                                    {`${patientSurvey?.member?.firstName} ${patientSurvey?.member?.lastName}`}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Overall Experience
                                </div>
                                <div>
                                    {getExperienceNameByNumber(patientSurvey?.overallExperience)}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Call Duration
                                </div>
                                <div>
                                    {patientSurvey?.callDuration ? `${formatNumber(patientSurvey.callDuration)} minutes` : 'Not Registered'}
                                </div>
                            </li>
                            </ul>
                        </div>
                        <br />
                        <div className="information-list-container" id="patient-section">
                            <div className="information-list-header">
                                <div className="">
                                    <h2 className="subheader-text">
                                        Patient
                                    </h2>
                                </div>
                            </div>
                            <ul className="body-text">
                            <li>
                                <div className="bold-text">
                                    Name
                                </div>
                                <div>
                                    {`${patientSurvey?.patient?.firstName} ${patientSurvey?.patient?.lastName}`}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Phone
                                </div>
                                <div>
                                    {`+${patientSurvey?.patient?.countryCode}${patientSurvey?.patient?.phone}`}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Gender
                                </div>
                                <div>
                                    {patientSurvey?.patient?.gender ? capitalizeFirstLetter(patientSurvey?.patient?.gender) : 'Not Registered'}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Social Status
                                </div>
                                <div>
                                    {patientSurvey?.patient?.socialStatus ? capitalizeFirstLetter(patientSurvey?.patient?.socialStatus) : 'Not Registered'}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Age
                                </div>
                                <div>
                                    {patientSurvey?.patient?.dateOfBirth ? getAge(patientSurvey?.patient?.dateOfBirth) : 'Not Registered'}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    City
                                </div>
                                <div>
                                {patientSurvey?.patient?.city ? capitalizeFirstLetter(patientSurvey?.patient?.city) : 'Not Registered'}
                                </div>
                            </li>
                            </ul>
                        </div>
                        <br />
                        <div className="information-list-container" id="waiting-section">
                            <div className="information-list-header">
                                <div className="">
                                    <h2 className="subheader-text">
                                        Waiting
                                    </h2>
                                </div>
                            </div>
                            <ul className="body-text">
                            <li>
                                <div className="bold-text">
                                    Waiting Satisfaction
                                </div>
                                <div>
                                    {getSatisfactionNameByNumber(patientSurvey?.waiting?.waitingSatisfaction)}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Time Waited
                                </div>
                                <div>
                                    {`${patientSurvey?.waiting?.timeWaited} minutes`}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Delay Occured
                                </div>
                                <div>
                                    {patientSurvey?.waiting?.isDelayHappened ? 'Yes' : 'No' }
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Delay Informed
                                </div>
                                <div>
                                    {patientSurvey?.waiting?.isDelayInformed ? 'Yes' : 'No' }
                                </div>
                            </li>
                            
                            </ul>
                        </div>
                        <br />
                        <div className="information-list-container" id="environment-section">
                            <div className="information-list-header">
                                <div className="">
                                    <h2 className="subheader-text">
                                        Environment
                                    </h2>
                                </div>
                            </div>
                            <ul className="body-text">
                            <li>
                                <div className="bold-text">
                                    Clean
                                </div>
                                <div>
                                    {patientSurvey?.environment?.isClean ? 'Yes' : 'No'}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Comfortable
                                </div>
                                <div>
                                    {patientSurvey?.environment?.isComfortable ? 'Yes' : 'No'}
                                </div>
                            </li>
                            </ul>
                        </div>
                        <br />
                        <div className="information-list-container" id="staff-section">
                            <div className="information-list-header">
                                <div className="">
                                    <h2 className="subheader-text">
                                        Staff
                                    </h2>
                                </div>
                            </div>
                            <ul className="body-text">
                            <li>
                                <div className="bold-text">
                                    Friendly
                                </div>
                                <div>
                                    {patientSurvey?.staff?.isFriendly ? 'Yes' : 'No'}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Responsive
                                </div>
                                <div>
                                    {patientSurvey?.staff?.isResponsive ? 'Yes' : 'No'}
                                </div>
                            </li>
                            </ul>
                        </div>
                        <br />
                        <div className="information-list-container" id="doctor-section">
                            <div className="information-list-header">
                                <div className="">
                                    <h2 className="subheader-text">
                                        Doctor
                                    </h2>
                                </div>
                            </div>
                            <ul className="body-text">
                            <li>
                                <div className="bold-text">
                                    Attentiveness
                                </div>
                                <div>
                                    {getSatisfactionNameByNumber(patientSurvey?.healthcareProvider?.attentiveness)}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Symptoms Addressed Adequately
                                </div>
                                <div>
                                    {patientSurvey?.healthcareProvider?.isAddressedAdequately ? 'Yes' : 'No'}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Treatment Explanation
                                </div>
                                <div>
                                    {getExplanationNameByNumber(patientSurvey?.healthcareProvider?.treatmentExplanation)}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Medical History Asked
                                </div>
                                <div>
                                    {patientSurvey?.healthcareProvider?.isMedicalHistoryAsked ? 'Yes' : 'No'}
                                </div>
                            </li>
                        </ul>
                        </div>
                        <br />
                        <div className="information-list-container" id="appointment-section">
                            <div className="information-list-header">
                                <div className="">
                                    <h2 className="subheader-text">
                                        Appointment
                                    </h2>
                                </div>
                            </div>
                            <ul className="body-text">
                            <li>
                                <div className="bold-text">
                                    Convenient Time Slot Found
                                </div>
                                <div>
                                    {patientSurvey?.appointments?.isConvenientTimeSlotFound ? 'Yes' : 'No'}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Scheduling ease
                                </div>
                                <div>
                                    {patientSurvey?.appointments?.isSchedulingEasy ? 'Yes' : 'No'}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Reminder Sent
                                </div>
                                <div>
                                    {patientSurvey?.appointments?.isReminderSent ? 'Yes' : 'No'}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Scheduling Way
                                </div>
                                <div>
                                    {patientSurvey?.appointments?.schedulingWay ? capitalizeFirstLetter(patientSurvey?.appointments?.schedulingWay) : 'Not Registered'}
                                </div>
                            </li>
                        </ul>
                        </div>
                    </div>

                    </div>
                }
            </div>
            <br />
        </div>
    </div>
}

export default PatientSurveyPage