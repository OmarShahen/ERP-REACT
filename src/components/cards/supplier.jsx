import { useState } from 'react'
import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CardTransition from '../transitions/card-transitions'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'


const SupplierCard = ({ supplier, setTarget, setIsShowDeleteModal, setIsShowUpdateModal, setIsUpdate }) => {

    const [isShowItems, setIsShowItems] = useState(false)

    const cardActionsList = [
        {
            name: 'مسح المورد',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTarget(supplier)
                setIsShowDeleteModal(true)
            }
        },
        {
            name: 'تحديث المورد',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTarget(supplier)
                setIsUpdate(true)
                setIsShowUpdateModal(true)
            }
        }
    ]

    return <CardTransition>
        <div 
        className="patient-card-container body-text disable-hover"
        >
            <div className="patient-card-header left-direction">
                <div className="patient-image-info-container">
                    <strong>{supplier.name}</strong>
                </div>
                <CardActions actions={cardActionsList} />
            </div>
            <div className="patient-card-body right-direction">
                <ul>
                    <li>
                        <strong>الرقم</strong>
                        <span>#{supplier.supplierId}</span>
                    </li>
                    <li>
                        <strong>الهاتف</strong>
                        <span>{supplier.phone}</span>
                    </li>
                    {
                        isShowItems ?
                        <div className="margin-top-1">
                                <div className="margin-bottom-1">
                                    <strong>الملحوظة:</strong>
                                </div>
                                {supplier.note}
                        </div>
                        :
                        null
                    }
                    <li className="margin-top-1">
                            <span></span>
                            <span onClick={e => {
                                e.stopPropagation()
                                setIsShowItems(!isShowItems)
                            }} className="bold-text action-color-text">{isShowItems ? 'اخفاء التفاصيل' : 'اظهار التفاصيل'}</span>
                    </li>
                </ul>
            </div>
            <CardDate 
            creationDate={supplier.createdAt}  
            updateDate={supplier.updatedAt} 
            />
        </div>
    </CardTransition>
}

export default SupplierCard