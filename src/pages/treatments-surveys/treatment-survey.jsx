import { useState, useEffect } from 'react'
import '../patient-medical.css'
import { serverRequest } from '../../components/API/request'
import CircularLoading from '../../components/loadings/circular'
import PageHeader from '../../components/sections/page-header'
import { capitalizeFirstLetter } from '../../utils/formatString'
import { getAge } from '../../utils/age-calculator'
import { getHealthImprovementNameByNumber } from '../../utils/experience-translator'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { formatNumber } from '../../utils/numbers'

const TreatmentSurveyPage = ({ roles }) => {

    const pagePath = window.location.pathname
    const treatmentSurveyId = pagePath.split('/')[2]

    const [isLoading, setIsLoading] = useState(true)
    const [treatmentSurvey, setTreatmentSurvey] = useState({})

    const [reload, setReload] = useState(1)

    useEffect(() => { 
        //scroll(0, 0) 
        //isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])
    
    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/treatments-surveys/${treatmentSurveyId}`)
        .then(response => {
            setIsLoading(false)
            const data = response.data
            setTreatmentSurvey(data.treatmentSurvey)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload])

    const formatValue = (value) => {

        if(typeof value !== 'boolean') {
            return 'Not Registered'
        } else if(value === true) {
            return 'Yes'
        } else if(value === false) {
            return 'No'
        }
    }


    return <div>
        <PageHeader
        pageName={`Treatment Survey #${treatmentSurvey?.treatmentSurveyId}`}
        addBtnText={'Update Survey'}
        addBtnTextIcon={<CreateOutlinedIcon />}
        setReload={setReload}
        reload={reload}
        formURL={`/treatments-surveys/${treatmentSurveyId}/treatment-survey/form?mode=UPDATE`}
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
                                    <a href="#side-effects-section">
                                        Side Effects & Symptoms
                                    </a>
                                </li>
                                
                                <li>
                                    <a href="#medication-section">
                                        Medication & Dosages
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
                                    {treatmentSurvey?.clinic?.name}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Patient
                                </div>
                                <div>
                                    {`${treatmentSurvey?.patient?.firstName} ${treatmentSurvey?.patient?.lastName ? treatmentSurvey?.patient?.lastName : ''}`}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Done By
                                </div>
                                <div>
                                    {`${treatmentSurvey?.member?.firstName} ${treatmentSurvey?.member?.lastName}`}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Improvement
                                </div>
                                <div>
                                    {getHealthImprovementNameByNumber(treatmentSurvey?.improvement)}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Did the overall health change
                                </div>
                                <div>
                                    { treatmentSurvey?.isOverallHealthChanged ? 'Yes' : 'No' }
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Call Duration
                                </div>
                                <div>
                                    {treatmentSurvey?.callDuration ? `${formatNumber(treatmentSurvey.callDuration)} minutes` : 'Not Registered'}
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
                                    {`${treatmentSurvey?.patient?.firstName} ${treatmentSurvey?.patient?.lastName ? treatmentSurvey?.patient?.lastName : ''}`}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Phone
                                </div>
                                <div>
                                    {`+${treatmentSurvey?.patient?.countryCode}${treatmentSurvey?.patient?.phone}`}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Gender
                                </div>
                                <div>
                                    {treatmentSurvey?.patient?.gender ? capitalizeFirstLetter(treatmentSurvey?.patient?.gender) : 'Not Registered'}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Social Status
                                </div>
                                <div>
                                    {treatmentSurvey?.patient?.socialStatus ? capitalizeFirstLetter(treatmentSurvey?.patient?.socialStatus) : 'Not Registered'}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Age
                                </div>
                                <div>
                                    {treatmentSurvey?.patient?.dateOfBirth ? getAge(treatmentSurvey?.patient?.dateOfBirth) : 'Not Registered'}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    City
                                </div>
                                <div>
                                {treatmentSurvey?.patient?.city ? capitalizeFirstLetter(treatmentSurvey?.patient?.city) : 'Not Registered'}
                                </div>
                            </li>
                            </ul>
                        </div>
                        <br />
                        <div className="information-list-container" id="side-effects-section">
                            <div className="information-list-header">
                                <div className="">
                                    <h2 className="subheader-text">
                                        Side Effects and Symptoms
                                    </h2>
                                </div>
                            </div>
                            <ul className="body-text">
                            <li>
                                <div className="bold-text">
                                    Is there any side effects
                                </div>
                                <div>
                                    {formatValue(treatmentSurvey?.isExperiencedSideEffects)}
                                </div>
                            </li>
                            <div>
                                <span className="bold-text body-text">Side Effects</span>
                                <div className="codes-container">
                                    {treatmentSurvey?.experiencedSideEffects?.map(effect => <span className="status-btn grey-bg">{effect}</span>)}
                                </div>
                            </div>
                            <li>
                                <div className="bold-text">
                                    Is there any new symptoms
                                </div>
                                <div>
                                    {formatValue(treatmentSurvey?.isNewSymptomsOccured)}
                                </div>
                            </li>
                            <div>
                                <span className="bold-text body-text">New Symptoms</span>
                                <div className="codes-container">
                                    {treatmentSurvey?.newSymptomsOccured?.map(symptom => <span className="status-btn grey-bg">{symptom}</span>)}
                                </div>
                            </div>
                            
                            </ul>
                        </div>
                        <br />
                        <div className="information-list-container" id="medication-section">
                            <div className="information-list-header">
                                <div className="">
                                    <h2 className="subheader-text">
                                        Medication & Dosages
                                    </h2>
                                </div>
                            </div>
                            <ul className="body-text">
                            <li>
                                <div className="bold-text">
                                    Is the medication took as prescribed
                                </div>
                                <div>
                                    {formatValue(treatmentSurvey?.isMedicationTookAsPrescribed)}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Is dosages missed
                                </div>
                                <div>
                                    {formatValue(treatmentSurvey?.isDosagesMissed)}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Is there challenges obtaining medication
                                </div>
                                <div>
                                    {formatValue(treatmentSurvey?.isThereChallengesObtainingMedication)}
                                </div>
                            </li>
                            <div>
                                <span className="bold-text body-text">Challenges obtaining medication</span>
                                <div className="codes-container">
                                    {treatmentSurvey?.challengesObtainingMedication?.map(challenge => <span className="status-btn grey-bg">{challenge.name}</span>)}
                                </div>
                            </div>
                            <li>
                                <div className="bold-text">
                                    Is there challenges taking medication
                                </div>
                                <div>
                                    {formatValue(treatmentSurvey?.isThereChallengesTakingMedication)}
                                </div>
                            </li>
                            <div>
                                <span className="bold-text body-text">Challenges taking medication</span>
                                <div className="codes-container">
                                    {treatmentSurvey?.challengesTakingMedication?.map(challenge => <span className="status-btn grey-bg">{challenge.name}</span>)}
                                </div>
                            </div>
                            <li>
                                <div className="bold-text">
                                    Is there problem remebering
                                </div>
                                <div>
                                    {formatValue(treatmentSurvey?.isThereProblemRemebering)}
                                </div>
                            </li>
                            <li>
                                <div className="bold-text">
                                    Is taking other outter medication
                                </div>
                                <div>
                                    {formatValue(treatmentSurvey?.isTakingOtherOutterMedication)}
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

export default TreatmentSurveyPage