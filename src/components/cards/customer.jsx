import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import CardTransition from '../transitions/card-transitions'
import { useNavigate } from 'react-router-dom'


const CustomerCard = ({ 
    customer, 
    setTarget, 
    setIsShowDeleteModal,
    setIsShowUpdateModal,
    setIsUpdate
}) => {    

    const navigate = useNavigate()

    const cardActionsList = [
        {
            name: 'Delete Customer',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTarget(customer)
                setIsShowDeleteModal(true)
            }
        },
        {
            name: 'Update Customer',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTarget(customer)
                setIsUpdate(true)
                setIsShowUpdateModal(true)
            }
        }
    ]


    return <CardTransition>
    <div 
    onClick={e => {
        e.stopPropagation()
        navigate(`/items/customers/${customer._id}`)
    }}
    className="patient-card-container body-text">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <div>
                    <strong>{customer.name}</strong>
                </div>
            </div>
            <CardActions actions={cardActionsList} />
        </div>
        <div className="patient-card-body">
            <ul>
                <li>
                    <strong>ID</strong>
                    <span>#{customer.customerId}</span>
                </li>
                <li>
                    <strong>Phone</strong>
                    <span>{customer?.phone}</span>
                </li>
            </ul>
        </div>
        <CardDate 
        creationDate={customer.createdAt}
        updateDate={customer.updatedAt}
        />
    </div>
    </CardTransition>
}

export default CustomerCard