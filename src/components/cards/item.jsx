import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import CardTransition from '../transitions/card-transitions'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import { useNavigate } from 'react-router-dom'

const ItemCard = ({ 
    item, 
    setTarget, 
    setIsShowDeleteModal,
    setIsShowUpdateModal,
    setIsUpdate
}) => {    

    const navigate = useNavigate()

    const cardActionsList = [
        {
            name: 'Delete Item',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTarget(item)
                setIsShowDeleteModal(true)
            }
        },
        {
            name: 'Update Item',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTarget(item)
                setIsUpdate(true)
                setIsShowUpdateModal(true)
            }
        },
        {
            name: 'View Images',
            icon: <ImageOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                navigate(`/items/${item._id}/images`)
            }
        }
    ]

    return <CardTransition>
    <div 
    className="patient-card-container body-text"
    onClick={e => {
        e.stopPropagation()
        setTarget(item)
        setIsUpdate(true)
        setIsShowUpdateModal(true)
    }}
    >
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <div>
                    <strong>#{item.itemId}</strong>
                </div>
            </div>
            <CardActions actions={cardActionsList} />
        </div>
        <div className="patient-card-body">
            <ul>
                <li>
                    <strong>Category</strong>
                    <span>{item?.category?.name}</span>
                </li>
                <li>
                    <strong>Subcategory</strong>
                    <span>{item?.subcategory?.name}</span>
                </li>
                <li>
                    <strong>Brand</strong>
                    <span>{item?.brand?.name}</span>
                </li>
                <li>
                    <strong>Owner</strong>
                    <span>{item?.owner?.name ? item?.owner?.name : 'Not Registered'}</span>
                </li>
                <li>
                    <strong>Phone</strong>
                    <span>{item?.owner?.phone ? item?.owner?.phone : 'Not Registered'}</span>
                </li>
            </ul>
        </div>
        <CardDate 
        creationDate={item.createdAt}
        updateDate={item.updatedAt}
        />
    </div>
    </CardTransition>
}

export default ItemCard