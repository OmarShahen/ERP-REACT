import '../modals.css'
import { TailSpin } from 'react-loader-spinner'
import ErrorIcon from '@mui/icons-material/Error'
import './confirmation-modal.css'
import translations from '../../../i18n'
import { useSelector } from 'react-redux'
import CardTransition from '../../transitions/card-transitions'


const DeleteConfirmationModal = ({ id, isLoading, setIsShowModal, deleteAction }) => {

    const lang = useSelector(state => state.lang.lang)   

    return <div className="modal">
        <CardTransition>
        <div className="confirmation-modal-container body-text">
             <div className="confirmation-modal-header">
                <h3>
                    <ErrorIcon />
                    {translations[lang]['Delete']}
                </h3>
            </div>   
            <div className="body-text confirmation-modal-body">
                <p>
                {translations[lang]["You're about to permanently delete this entity and all it's attachments"]}
                </p>
                <p>
                    {translations[lang]["If you're not sure, you can resolve or close it instead"]}
                </p>
            </div>    
            <div className="confirmation-modal-buttons-container">
                {
                    isLoading ?
                    <TailSpin width="25" height="25" color="#DE350B" />
                    :
                    <button 
                    className="button delete-button" 
                    onClick={() => {
                        deleteAction(id)
                    }}
                    >{translations[lang]['Delete']}</button>
                }
                <button 
                className="button abort-button"
                onClick={e => setIsShowModal(false)}
                >{translations[lang]['Cancel']}</button>
            </div>        
        </div>
        </CardTransition>
    </div>
}

export default DeleteConfirmationModal