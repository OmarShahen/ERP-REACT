import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import CardTransition from '../transitions/card-transitions'

const ArrivalMethodCard = ({ 
    arrivalMethod, 
    setTargetArrivalMethod, 
    setIsUpdateArrivalMethod,
    setIsShowDeleteArrivalMethod,
    setIsShowAddArrivalMethodForm
}) => {


    const cardActionsList = [
        {
            name: 'Delete Arrival Method',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetArrivalMethod(arrivalMethod)
                setIsShowDeleteArrivalMethod(true)
            }
        },
        {
            name: 'Update Arrival Method',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetArrivalMethod(arrivalMethod)
                setIsUpdateArrivalMethod(true)
                setIsShowAddArrivalMethodForm(true)
            }
        }
     ]

    return <CardTransition>
        <div 
        className="patient-card-container body-text disable-hover">
            <div className="patient-card-header">
                <div className="patient-image-info-container">
                    <div>
                        <strong>{arrivalMethod.name}</strong>
                    </div>
                </div>
                <CardActions actions={cardActionsList} />
            </div>
            <div className="patient-card-body">
                
            </div>
            <CardDate creationDate={arrivalMethod.createdAt}  updateDate={arrivalMethod.updatedAt} />
        </div>
    </CardTransition>
}

export default ArrivalMethodCard