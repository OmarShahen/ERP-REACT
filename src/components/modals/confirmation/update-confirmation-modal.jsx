import '../modals.css'
import { TailSpin } from 'react-loader-spinner'
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined'
import './confirmation-modal.css'
import CardTransition from '../../transitions/card-transitions'


const UpdateConfirmationModal = ({ target, isLoading, setIsShowModal, updateAction }) => {

    return <div className="modal">
        <CardTransition>  
        <div className="confirmation-modal-container body-text">
            <div className="confirmation-modal-header">
                <h3>
                    <CurrencyExchangeOutlinedIcon style={{ color: '#5c60f5'}} />
                    المرتجع
                </h3>
            </div>  
            <div className="body-text confirmation-modal-body">
                <p>
                أنت على وشك {target.isRefunded ? 'استرداد' : 'ارتجاع'} الطلب رقم <strong>{target.orderId}#</strong>
                </p>
                <p>
                    إذا لم تكن متأكدًا، يمكنك إغلاقها                   
                </p>
            </div>    
            <div className="confirmation-modal-buttons-container">
                {
                    isLoading ?
                    <TailSpin width="25" height="25" color="#5c60f5" />
                    :
                    <button 
                    className="button" 
                    onClick={updateAction}
                    >تحديث</button>
                }
                <button 
                className="button abort-button"
                onClick={() => setIsShowModal(false)}
                >اغلاق</button>
            </div>          
        </div>
        </CardTransition>
    </div>
}

export default UpdateConfirmationModal