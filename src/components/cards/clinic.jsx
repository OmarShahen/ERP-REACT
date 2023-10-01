import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { useNavigate } from 'react-router-dom'
import CardTransition from '../transitions/card-transitions'
import { capitalizeFirstLetter } from '../../utils/formatString'
import { format } from 'date-fns'
import translations from '../../i18n'
import { useSelector } from 'react-redux'


const ClinicCard = ({ clinic, isOwner, setIsShowDeleteModal, setTargetClinic, isShowRenew, disableOnClickView }) => {

    const navigate = useNavigate()
    const lang = useSelector(state => state.lang.lang)

    const _id = clinic._id
    const clinicId = clinic?.clinicId
    const name = clinic?.name
    const phone = `+${clinic?.countryCode}${clinic?.phone}`
    const city = clinic?.city
    const country = clinic?.country
    const mode = clinic?.mode

    const cardActionsList = [
        {
            name: translations[lang]['Delete Clinic'],
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetClinic(clinic)
                setIsShowDeleteModal(true)
            }
        },
     ]

    return <CardTransition>
    <div className={`patient-card-container body-text`}>
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <img src={`https://avatars.dicebear.com/api/initials/${name}.svg`} alt="patient-image" />
                <div>
                    <strong>{name}</strong>
                    <span className="grey-text">#{clinicId}</span>
                </div>
            </div>
        </div>
        <div className="patient-card-body">
            <ul>
                <li>
                    <strong>Phone</strong>
                    <span>{phone}</span>
                </li>
                <li>
                    <strong>{translations[lang]['Country']}</strong>
                    <span>{translations[lang][capitalizeFirstLetter(country)]}</span>
                </li>
                <li>
                    <strong>{translations[lang]['City']}</strong>
                    <span>{translations[lang][capitalizeFirstLetter(city)]}</span>
                </li>
                <li>
                    <strong>{translations[lang]['Mode']}</strong>
                    {
                        mode === 'TEST' ?
                        <span className="status-btn pending bold-text">{mode ? translations[lang][capitalizeFirstLetter(mode)] : ''}</span>
                        :
                        <span className="status-btn done bold-text">{mode ? translations[lang][capitalizeFirstLetter(mode)] : ''}</span>

                    }
                </li>
                <li>
                    <strong>{translations[lang]['Renew Date']}</strong>
                    { clinic?.activeUntilDate ? 
                    <span>{format(new Date(clinic?.activeUntilDate), lang === 'en' ? 'dd MMMM yyyy' : 'MM/dd/yyyy')}</span> 
                    : 
                    translations[lang]['Not Registered'] }
                </li>
            </ul>
        </div>
        <CardDate creationDate={clinic.createdAt} />
    </div>
    </CardTransition>
}

export default ClinicCard