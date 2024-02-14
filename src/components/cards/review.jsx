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
import { getExperienceNameByNumber } from '../../utils/experience-translator'
import CardImage from './components/image'

const ReviewCard = ({ review, reload, setReload, setTargetReview, setIsShowDeleteModal }) => {

    const navigate = useNavigate()

    const renderSurveyStatus = (status) => {

        if(status === 1) {
            return <span className="status-btn declined bold-text">{getExperienceNameByNumber(status)}</span>         
        } else if(status === 4) {
            return <span className="status-btn pending bold-text">{getExperienceNameByNumber(status)}</span>      
        } else if(status === 2) {
            return <span className="status-btn tag-orange-bg white-text bold-text">{getExperienceNameByNumber(status)}</span>      
        } else if(status === 5) {
            return <span className="status-btn done bold-text">{getExperienceNameByNumber(status)}</span>    
        } else if(status === 3) {
            return <span className="status-btn grey-bg bold-text">{getExperienceNameByNumber(status)}</span>
        }
    }


    const cardActionsList = [
        {
            name: 'Delete Review',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetReview(review)
                setIsShowDeleteModal(true)
            }
        },
        {
            name: 'View Patient',
            icon: <HotelOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                navigate(`/patients/${review.patientId}/clinics/${review.clinicId}/medical-profile`)
            }
        },
    ]

    return <CardTransition>
        <div 
        className="patient-card-container body-text">
            <div className="patient-card-header">
            <div className="patient-image-info-container">
                <CardImage 
                name={review?.seeker?.firstName} 
                imageURL={review?.seeker?.profileImageURL}
                />
                    <div>
                        <strong>{review?.seeker?.firstName}</strong>
                        <span className="grey-text">{`+${review?.seeker?.countryCode}${review?.seeker?.phone}`}</span>
                    </div>
                </div>
                <CardActions actions={cardActionsList} />
            </div>
            <div className="patient-card-body">
                <ul>
                    <li>
                        <strong>ID</strong>
                        <span>#{review.reviewId}</span>
                    </li>
                    <li>
                        <strong>Expert</strong>
                        <span>{review?.expert?.firstName}</span>
                    </li>
                    <li>
                        <strong>Rating</strong>
                        {renderSurveyStatus(review.rating)}
                    </li>
                    <li>
                        <strong>Recommend</strong>
                        {review?.isRecommend ? 'Yes' : 'No'}
                    </li>
                </ul>
            </div>
            <CardDate creationDate={review.createdAt}  updateDate={review.updatedAt} />
        </div>
    </CardTransition>
}

export default ReviewCard