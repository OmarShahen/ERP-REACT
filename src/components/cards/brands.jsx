import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import CardTransition from '../transitions/card-transitions'


const BrandCard = ({ 
    brand, 
    setTarget, 
    setIsShowDeleteModal,
    setIsShowUpdateModal
}) => {    

    const cardActionsList = [
        {
            name: 'Delete Brand',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTarget(brand)
                setIsShowDeleteModal(true)
            }
        },
        {
            name: 'Update Brand',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTarget(brand)
                setIsShowUpdateModal(true)
            }
        }
    ]


    return <CardTransition>
    <div onClick={() => {
        setTarget(brand)
        setIsShowUpdateModal(true)
    }} className="patient-card-container body-text">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <div>
                    <strong>{brand.name}</strong>
                </div>
            </div>
            <CardActions actions={cardActionsList} />
        </div>
        <div className="patient-card-body">
            <ul>
                <li>
                    <strong>ID</strong>
                    <span>#{brand.brandId}</span>
                </li>
                <li>
                    <strong>Category</strong>
                    <span>{brand?.category?.name}</span>
                </li>
            </ul>
        </div>
        <CardDate 
        creationDate={brand.createdAt}
        updateDate={brand.updatedAt}
        />
    </div>
    </CardTransition>
}

export default BrandCard