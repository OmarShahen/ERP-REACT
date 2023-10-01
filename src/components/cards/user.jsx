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
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
import { format, formatDistance  } from 'date-fns'


const UserCard = ({ user, reload, setReload, setTargetUser, setIsShowUpdateUser}) => {

    const navigate = useNavigate()

    const lang = useSelector(state => state.lang.lang)

    const userName = `${user.firstName} ${user.lastName}`

    const cardActionsList = []

    return <CardTransition>
        <div 
        className="patient-card-container body-text disable-hover">
            <div className="patient-card-header">
                <div className="patient-image-info-container">
                    <img src={`https://avatars.dicebear.com/api/initials/${userName}.svg`} alt="patient-image" />
                    <div>
                        <strong>{userName}</strong>
                        <span className="grey-text">{user.email}</span>
                    </div>
                </div>
                <CardActions actions={cardActionsList} />
            </div>
            <div className="patient-card-body">
                <ul>
                    <li>
                        <strong>ID</strong>
                        <span>#{user.userId}</span>
                    </li>
                    <li>
                        <strong>{translations[lang]['Gender']}</strong>
                        <span>{user.gender ? translations[lang][capitalizeFirstLetter(user.gender)] : translations[lang]['Not registered']}</span>
                    </li>
                    <li>
                        <strong>{translations[lang]['Age']}</strong>
                        <span>{user.dateOfBirth ? getAge(user.dateOfBirth) : translations[lang]['Not Registered']}</span>
                    </li>
                    <li>
                        <strong>Status</strong>
                        {
                            user?.isVerified ?
                            <span className="status-btn done bold-text">Verified</span>
                            :
                            <span className="status-btn rejected bold-text">Not Verified</span>
                        }
                    </li>
                    <li>
                        <strong>Last Login</strong>
                        <span>{user.lastLoginDate ? formatDistance(new Date(user.lastLoginDate), new Date(), { addSuffix: true }) : 'Not Registered'}</span>
                    </li>
                </ul>
                {
                        user?.roles.length !== 0 ?
                        <div>
                            <div className="codes-container">
                                { user.roles.map(role => <span className="status-btn pending bold-text">
                                    {capitalizeFirstLetter(role)}                        
                                </span>) }
                            </div>
                        </div>
                        :
                        null
                    }
            </div>
            <CardDate 
            creationDate={user.createdAt}  
            updateDate={user.updatedAt} 
            />
        </div>
    </CardTransition>
}

export default UserCard