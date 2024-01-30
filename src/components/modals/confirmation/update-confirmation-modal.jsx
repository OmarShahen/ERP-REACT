import '../modals.css'
import { TailSpin } from 'react-loader-spinner'
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined'
import './confirmation-modal.css'


const UpdateConfirmationModal = ({ target, isLoading, setIsShowModal, updateAction }) => {

    return <div className="modal">
        <div className="confirmation-modal-container body-text">
            <div className="confirmation-modal-header">
                <h3>
                    <CurrencyExchangeOutlinedIcon style={{ color: '#5c60f5'}} />
                    Refund
                </h3>
            </div>  
            <div className="body-text confirmation-modal-body">
                <p>
                    You're about to refund payment #{target.paymentId}
                </p>
                <p>
                    If you're not sure, you can resolve or close it instead
                </p>
            </div>    
            <div className="confirmation-modal-buttons-container">
                {
                    isLoading ?
                    <TailSpin width="25" height="25" color="#5c60f5" />
                    :
                    <button 
                    className="button" 
                    onClick={() => {
                        updateAction(target.appointmentId)
                    }}
                    >Refund</button>
                }
                <button 
                className="button abort-button"
                onClick={() => setIsShowModal(false)}
                >Cancel</button>
            </div>          
        </div>
    </div>
}

export default UpdateConfirmationModal