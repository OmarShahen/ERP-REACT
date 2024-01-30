import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import CardTransition from '../transitions/card-transitions'

const ExpertVerificationCard = ({ 
    expertVerification, 
    setTarget, 
    setIsShowDeleteModal,
    setIsShowUpdateModal
}) => {    

    const cardActionsList = [
        {
            name: 'Delete Expert Verification',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTarget(expertVerification)
                setIsShowDeleteModal(true)
            }
        },
    ]

    const renderStatus = (status) => {
        
        if(status === 'ACCEPTED') {
            return <span className="status-btn done bold-text">Accepted</span>
        } else if (status === 'REJECTED') {
            return <span className="status-btn declined bold-text">Rejected</span>
        }

        return <span className="status-btn pending bold-text">Pending</span>
    }

    return <CardTransition>
    <div onClick={() => {
        setTarget(expertVerification)
        setIsShowUpdateModal(true)
    }} className="patient-card-container body-text">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <div>
                    <strong>{expertVerification.name}</strong>
                    <span className="grey-text">{expertVerification.email}</span>
                </div>
            </div>
            <CardActions actions={cardActionsList} />
        </div>
        <div className="patient-card-body">
            <ul>
                <li>
                    <strong>ID</strong>
                    <span>#{expertVerification.expertVerificationId}</span>
                </li>
                <li>
                    <strong>Phone</strong>
                    <span>{`+${expertVerification.countryCode}${expertVerification.phone}`}</span>
                </li>
                <li>
                    <strong>Speciality</strong>
                    <span>{expertVerification?.speciality?.name}</span>
                </li>
                <li>
                    <strong>Status</strong>
                    {renderStatus(expertVerification.status)}
                </li>
            </ul>
        </div>
        <CardDate 
        creationDate={expertVerification.createdAt}
        updateDate={expertVerification.updatedAt}
        />
    </div>
    </CardTransition>
}

export default ExpertVerificationCard