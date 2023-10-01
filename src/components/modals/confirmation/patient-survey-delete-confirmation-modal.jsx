import { useState } from 'react'
import '../modals.css'
import { serverRequest } from '../../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import ErrorIcon from '@mui/icons-material/Error'
import './confirmation-modal.css'
import translations from '../../../i18n'
import { useSelector } from 'react-redux'

const PatientSurveyDeleteConfirmationModal = ({ survey, reload, setReload, setIsShowModal }) => {

    const lang = useSelector(state => state.lang.lang)

    const [isLoading, setIsLoading] = useState(false)

    const deletePatientSurvey = () => {
        setIsLoading(true)
        serverRequest.delete(`/v1/patients-surveys/${survey._id}`)
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
                    onClick={e => {
                        deletePatientSurvey()
                    }}
                    >{translations[lang]['Delete']}</button>
                }
                <button 
                className="button abort-button"
                onClick={e => setIsShowModal(false)}
                >{translations[lang]['Cancel']}</button>
            </div>        
        </div>
    </div>
}

export default PatientSurveyDeleteConfirmationModal