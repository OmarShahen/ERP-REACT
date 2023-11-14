import '../patient.css'
import CardDate from '../components/date'
import CardActions from '../components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import CardTransition from '../../transitions/card-transitions'
import { capitalizeFirstLetter } from '../../../utils/formatString'


const StageCard = ({ 
    stage, 
    setTargetStage, 
    setIsShowDeleteModal,
    setIsUpdate,
    setIsShowUpdateModal,
}) => {

    const cardActionsList = [
        {
            name: 'Delete Stage',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetStage(stage)
                setIsShowDeleteModal(true)
            }
        },
        {
            name: 'Update Stage',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetStage(stage)
                setIsUpdate(true)
                setIsShowUpdateModal(true)
            }
        }
    ]

    return <CardTransition>
    <div 
    className="patient-card-container body-text"
    onClick={e => {
        e.stopPropagation()
        setTargetStage(stage)
        setIsUpdate(true)
        setIsShowUpdateModal(true)
    }}
    >
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <div>
                    <span className="grey-text bold-text">{stage?.lead?.name}</span>
                    <br />
                    <span className="grey-text">#{stage?.stageId}</span>
                </div>
            </div>
            <CardActions actions={cardActionsList} />
        </div>
        {
            stage?.note ?
            <div className="patient-card-body body-text">
                {stage.note}
            </div>
            :
            null
        }
        <div className="cards-tags-container margin-top-1">
            <span className="status-btn pending bold-text">
                {capitalizeFirstLetter(stage.stage)}
            </span>
        </div>
        <CardDate 
        creationDate={stage.createdAt}
        updateDate={stage.updatedAt}
        />
    </div>
    </CardTransition>
}

export default StageCard