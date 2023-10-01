import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { useNavigate } from 'react-router-dom'
import CardTransition from '../transitions/card-transitions'
import { capitalizeFirstLetter } from '../../utils/formatString'
import { useSelector } from 'react-redux'
import translations from '../../i18n'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
import { format } from 'date-fns'

const PrescriptionSurveyCard = ({ prescription, reload, setReload, setTargetPrescription, setIsShowUpdatePrescription }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const patientName = `${prescription.patient.firstName} ${prescription.patient.lastName}`
    const patientPhone = `+${prescription.patient.countryCode}${prescription.patient.phone}`

    const cardActionsList = [
        {
            name: prescription?.survey?.isDone ? 'Waiting Survey' : 'Done Survey',
            icon: prescription?.survey?.isDone ? <HourglassEmptyOutlinedIcon /> : <CheckCircleOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetPrescription(prescription)
                setIsShowUpdatePrescription(true)
            }
        }
     ]

    return <CardTransition>
        <div 
        className="patient-card-container body-text">
            <div className="patient-card-header">
                <div className="patient-image-info-container">
                    <img src={`https://avatars.dicebear.com/api/initials/${patientName}.svg`} alt="patient-image" />
                    <div>
                        <strong>{patientName}</strong>
                        <span className="grey-text">#{prescription?.patient?.patientId}</span>
                    </div>
                </div>
                <CardActions actions={cardActionsList} />
            </div>
            <div className="patient-card-body">
                <ul>
                    <li>
                        <strong>ID</strong>
                        <span>#{prescription?.prescriptionId}</span>
                    </li>
                    <li>
                        <strong>{translations[lang]['Clinic']}</strong>
                        <span>{prescription?.clinic?.name}</span>
                    </li>
                    <li>
                        <strong>{translations[lang]['Doctor']}</strong>
                        <span>{prescription?.doctor?.firstName + ' ' + prescription?.doctor?.lastName}</span>
                    </li>
                    <li>
                        <strong>{translations[lang]['Phone']}</strong>
                        <span>{patientPhone}</span>
                    </li>
                    {
                        prescription?.treatmentEndDate ?
                        <li>
                            <strong>{'Treatment Done'}</strong>
                            <span>{format(new Date(prescription?.treatmentEndDate), 'yyyy MMMM dd')}</span>
                        </li>
                        :
                        null
                    }
                    <li>
                        <strong>Survey</strong>
                        {
                            prescription?.survey?.isDone ?
                            <span className="status-btn done bold-text">Done</span>
                            :
                            <span className="status-btn pending bold-text">Waiting</span>
                        }
                    </li>
                    {
                        prescription?.member ?
                        <li>
                            <strong>Done By</strong>
                            <span>{prescription?.member?.firstName + ' ' + prescription?.member?.lastName}</span>
                        </li>
                        :
                        null
                    }
                    
                </ul>
            </div>
            <CardDate 
            creationDate={prescription.createdAt}  
            updateDate={prescription?.survey?.doneDate} 
            />
        </div>
    </CardTransition>
}

export default PrescriptionSurveyCard