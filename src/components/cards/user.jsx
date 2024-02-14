import './patient.css'
import { getAge } from '../../utils/age-calculator'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CardTransition from '../transitions/card-transitions'
import { capitalizeFirstLetter } from '../../utils/formatString'
import { useSelector } from 'react-redux'
import translations from '../../i18n'
import { formatDistance  } from 'date-fns'
import CardImage from './components/image'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'


const UserCard = ({ user, setTargetUser, setIsShowDeleteModal }) => {

    const lang = useSelector(state => state.lang.lang)

    const userName = `${user.firstName}`

    const cardActionsList = [
        {
            name: 'Delete User',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetUser(user)
                setIsShowDeleteModal(true)
            }
        },
        {
            name: 'View Profile',
            icon: <RemoveRedEyeOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                window.location.href = `https://ra-aya.web.app/experts/${user._id}`
            }
        }
    ]

    return <CardTransition>
        <div 
        className="patient-card-container body-text disable-hover">
            <div className="patient-card-header">
                <div className="patient-image-info-container">
                    <CardImage 
                    name={userName}  
                    imageURL={user.profileImageURL}
                    />
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
                        <strong>Phone</strong>
                        <span>+{user.countryCode}{user.phone}</span>
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
                        <strong>Type</strong>
                        <span>{user.type ? capitalizeFirstLetter(user.type) : 'Not Registered'}</span>
                    </li>
                    <li>
                        <strong>Onboarding</strong>
                        {
                            user.isOnBoarded ?
                            <span className="status-btn done bold-text">Done</span>
                            :
                            <span className="status-btn pending bold-text">Pending</span>
                        }
                    </li>
                    <li>
                        <strong>Setup</strong>
                        <span>{user.profileCompletion ? `${user.profileCompletion}%` : 'Not Registered'}</span>
                    </li>
                    <li>
                        <strong>Last Login</strong>
                        <span>{user.lastLoginDate ? formatDistance(new Date(user.lastLoginDate), new Date(), { addSuffix: true }) : 'Not Registered'}</span>
                    </li>
                </ul>
            </div>
            <CardDate 
            creationDate={user.createdAt}  
            updateDate={user.updatedAt} 
            />
        </div>
    </CardTransition>
}

export default UserCard