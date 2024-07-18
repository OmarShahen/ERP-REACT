import { useState } from 'react'
import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { formatNumber } from '../../utils/numbers'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import CardTransition from '../transitions/card-transitions'


const StockRecordCard = ({ 
    stockRecord, 
    setTarget, 
    setIsShowDeleteModal,
}) => {

    const cardActionsList = [
        {
            name: 'مسح المعاملة',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTarget(stockRecord)
                setIsShowDeleteModal(true)
            }
        }
    ]

    const types = [
        { name: 'استلام', value: 'PURCHASE' },
        { name: 'بيع', value: 'SALE' },
        { name: 'استرجاع', value: 'RETURN' },
        { name: 'تعديل', value: 'ADJUSTMENT' },
        { name: 'اتلاف', value: 'DAMAGE' },
        { name: 'سرقة', value: 'THEFT' },
    ]

    const getTypeName = (value) => {
        for(let i=0;i<types.length;i++) {
            if(types[i].value === value) {
                return types[i].name
            }
        }
    }


    return <CardTransition>
    <div className="patient-card-container body-text">
        <div className="patient-card-header left-direction">
            <div className="patient-image-info-container">
                <div>
                    <strong>#{stockRecord.stockRecordId}</strong>
                </div>
            </div>
            <CardActions actions={cardActionsList} />
        </div>
        <div className="patient-card-body">
            <ul>
                <li>
                    <span>المنتج</span>
                    <span>{stockRecord?.item?.name}</span>
               </li>
               <li>
                    <span>المسجل</span>
                    <span>{stockRecord?.user?.firstName}</span>
               </li>
               <li>
                    <span>الفئة</span>
                    <span>{getTypeName(stockRecord.type)}</span>
               </li>
               <li>
                    <span>الكمية</span>
                    <span>{formatNumber(Math.abs(stockRecord.quantity))}</span>
               </li>
               <li>
                    <span>السعر</span>
                    <span>{formatNumber((Math.abs(stockRecord.totalPrice / stockRecord.quantity)).toFixed(2))} EGP</span>
               </li>
               <li>
                    <span>الاجمالي</span>
                    <span className="bold-text">{formatNumber(stockRecord.totalPrice)} EGP</span>
               </li>
               <li>
                    <span>النوع</span>
                    {
                        !stockRecord.effect ?
                        <span className="status-btn grey-bg bold-text">غير مسجل</span>
                        :
                        stockRecord.effect === 'WIN' ?
                        <span className="status-btn done bold-text">ايرادات</span>
                        :
                        <span className="status-btn declined bold-text">مصروفات</span>
                    }
               </li>
            </ul>
        </div>
        <CardDate 
        creationDate={stockRecord.createdAt}
        updateDate={stockRecord.updatedAt}
        />
    </div>
    </CardTransition>
}

export default StockRecordCard