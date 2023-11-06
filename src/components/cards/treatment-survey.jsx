import './patient.css'
import { getAge } from '../../utils/age-calculator'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { useNavigate } from 'react-router-dom'
import CardTransition from '../transitions/card-transitions'
import { capitalizeFirstLetter } from '../../utils/formatString'
import { useSelector } from 'react-redux'
import translations from '../../i18n'
import { formatNumber } from '../../utils/numbers'
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined'
import { getHealthImprovementNameByNumber } from '../../utils/experience-translator'

const TreatmentSurveyCard = ({ survey, reload, setReload, setTargetSurvey, setIsShowUpdateSurvey, setIsShowDeleteSurveyModal }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const patientName = `${survey.patient.firstName} ${survey?.patient?.lastName ? survey.patient.lastName : ''}`
    const patientPhone = `+${survey.patient.countryCode}${survey.patient.phone}`
    const memberName = `${survey.member.firstName} ${survey.member.lastName}`

    const renderSurveyStatus = (status) => {

        if(status === 1) {
            return <span className="status-btn declined bold-text">{getHealthImprovementNameByNumber(status)}</span>         
        } else if(status === 4) {
            return <span className="status-btn pending bold-text">{getHealthImprovementNameByNumber(status)}</span>      
        } else if(status === 2) {
            return <span className="status-btn tag-orange-bg white-text bold-text">{getHealthImprovementNameByNumber(status)}</span>      
        } else if(status === 5) {
            return <span className="status-btn done bold-text">{getHealthImprovementNameByNumber(status)}</span>    
        } else if(status === 3) {
            return <span className="status-btn grey-bg bold-text">{getHealthImprovementNameByNumber(status)}</span>
        }
    }


    const cardActionsList = [
        {
            name: 'Delete Survey',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetSurvey(survey)
                setIsShowDeleteSurveyModal(true)
            }
        },
        {
            name: 'Update Survey',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                navigate(`/treatments-surveys/${survey._id}/treatment-survey/form?mode=UPDATE`)
            }
        },
        {
            name: 'View Patient',
            icon: <HotelOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                navigate(`/patients/${survey.patientId}/clinics/${survey.clinicId}/medical-profile`)
            }
        },
    ]

    return <CardTransition>
        <div 
        onClick={e => navigate(`/treatments-surveys/${survey._id}`)}
        className="patient-card-container body-text">
            <div className="patient-card-header">
            <div className="patient-image-info-container">
                    <img src={`https://avatars.dicebear.com/api/initials/${patientName}.svg`} alt="patient-image" />
                    <div>
                        <strong>{patientName}</strong>
                        <span className="grey-text">{patientPhone}</span>
                    </div>
                </div>
                <CardActions actions={cardActionsList} />
            </div>
            <div className="patient-card-body">
                <ul>
                    <li>
                        <strong>ID</strong>
                        <span>#{survey.treatmentSurveyId}</span>
                    </li>
                    <li>
                        <strong>Clinic</strong>
                        <span>{survey.clinic.name}</span>
                    </li>
                    <li>
                        <strong>Patient</strong>
                        <span>{patientName}</span>
                    </li>
                    <li>
                        <strong>Done By</strong>
                        <span>{memberName}</span>
                    </li>
                    <li>
                        <strong>Call Duration</strong>
                        <span>{survey?.callDuration ? `${formatNumber(survey?.callDuration)} minutes` : 'Not Registered'}</span>
                    </li>
                    <li>
                        <strong>Health Improved</strong>
                        {renderSurveyStatus(survey.improvement)}
                    </li>
                </ul>
            </div>
            <CardDate creationDate={survey.createdAt}  updateDate={survey.updatedAt} />
        </div>
    </CardTransition>
}

export default TreatmentSurveyCard