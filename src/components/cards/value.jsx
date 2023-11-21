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
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined'
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined'
import { SignalWifiStatusbarNullTwoTone } from '@mui/icons-material'
import { capitalizeFirstLetter, formatPatientName } from '../../utils/formatString'

const ValueCard = ({ 
    value, 
    setTargetValue, 
    setIsShowDeleteModal,
    setIsUpdate,
    setShowFormModal,
}) => {    

    const cardActionsList = [
        {
            name: 'Delete Value',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetValue(value)
                setIsShowDeleteModal(true)
            }
        },
        {
            name: 'Update Value',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetValue(value)
                setIsUpdate(true)
                setShowFormModal(true)
            }
        }
     ]

    return <CardTransition>
    <div className="patient-card-container body-text">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <div>
                    <span className="grey-text">
                        {`${capitalizeFirstLetter(value.entity)} #${value.valueId}`}
                    </span>
                </div>
            </div>
            <CardActions actions={cardActionsList} />
        </div>
        <div className="cards-tags-container margin-top-1">
            <span className="status-btn pending">{capitalizeFirstLetter(value.value)}</span>
        </div>
        <CardDate 
        creationDate={value.createdAt}
        updateDate={value.updatedAt}
        />
    </div>
    </CardTransition>
}

export default ValueCard