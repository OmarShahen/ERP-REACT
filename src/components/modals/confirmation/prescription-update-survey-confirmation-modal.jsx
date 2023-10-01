import { useState } from 'react'
import '../modals.css'
import { serverRequest } from '../../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined'
import './confirmation-modal.css'
import translations from '../../../i18n'
import { useSelector } from 'react-redux'

const PrescriptionUpdateSurveyConfirmationModal = ({ prescription, isSurveyed, reload, setReload, setIsShowModal }) => {

    const lang = useSelector(state => state.lang.lang)

    const [isLoading, setIsLoading] = useState(false)

    const updateSurveyStatus = () => {
        setIsLoading(true)
        serverRequest.patch(`/v1/prescriptions/${prescription._id}/survey`, { isSurveyed })
        .then(response => {
            setIsLoading(false)
            const data = response.data
            setReload(reload + 1)
            setIsShowModal(false)
            toast.success(data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }
   

    return <div className="modal">
        <div className="confirmation-modal-container body-text">
             <div className="confirmation-modal-header">
                <h3>
                    <CurrencyExchangeOutlinedIcon style={{ color: '#5c60f5'}} />
                    Update Prescription Survey Status
                </h3>
            </div>   
            <div className="body-text confirmation-modal-body">
                <p>
                    You 're about to update the prescription survey status into 
                    { 
                        isSurveyed ? 
                        <span className="tag-green-text bold-text"> Done</span>
                        : 
                        <span className="tag-purple-text bold-text"> Waiting</span>
                    }
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
                    onClick={e => {
                        updateSurveyStatus()
                    }}
                    >Update</button>
                }
                <button 
                className="button abort-button"
                onClick={e => setIsShowModal(false)}
                >{translations[lang]['Cancel']}</button>
            </div>        
        </div>
    </div>
}

export default PrescriptionUpdateSurveyConfirmationModal