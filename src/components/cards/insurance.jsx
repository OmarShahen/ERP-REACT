import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { useSelector } from 'react-redux'
import CardTransition from '../transitions/card-transitions'
import translations from '../../i18n'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'

const InsuranceCard = ({ 
    insurance, 
    setTargetInsurance, 
    setIsShowDeleteModal,
    setIsUpdate,
    setShowFormModal
}) => {

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const navigate = useNavigate()
    

    const cardActionsList = [
        {
            name: translations[lang]['Delete Insurance'],
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetInsurance(insurance)
                setIsShowDeleteModal(true)
            }
        },
        {
            name: translations[lang]['Update Insurance'],
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetInsurance(insurance)
                setIsUpdate(true)
                setShowFormModal(true)
            }
        },
     ]

    return <CardTransition>
    <div onClick={e => navigate(`/insurance-companies/${insurance._id}/invoices`)} className="patient-card-container body-text">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <div>
                    <strong>{insurance.name}</strong>
                    <span className="grey-text">{''}</span>
                </div>
            </div>
            {<CardActions actions={cardActionsList} />}
        </div>
        <div className="patient-card-body">
            <ul>
                <li>
                    <strong>{translations[lang]['Clinic']}</strong>
                    <span>{insurance.clinic.name}</span>
                </li>
                {
                    insurance.startDate ?
                    <li>
                        <strong>{translations[lang]['Start Date']}</strong>
                        <span>{format(new Date(insurance.startDate), lang === 'en' ? 'd MMM yyyy' : 'MM/dd/yyyy')}</span>
                    </li>
                    :
                    null
                }
                {
                    insurance.endDate ?
                    <li>
                        <strong>{translations[lang]['End Date']}</strong>
                        <span>{format(new Date(insurance.endDate), lang === 'en' ? 'd MMM yyyy' : 'MM/dd/yyyy')}</span>
                    </li>
                    :
                    null
                }
            </ul>
        </div>
        <CardDate 
        creationDate={insurance.createdAt}
        updateDate={insurance.updatedAt}
        />
    </div>
    </CardTransition>
}

export default InsuranceCard