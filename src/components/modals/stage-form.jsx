import { useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'
import translations from '../../i18n'
import SearchLeadsInputField from '../inputs/search-leads'
import { capitalizeFirstLetter } from '../../utils/formatString'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { leadStatus, leadStages } from '../../utils/values'


const StageFormModal = ({ setShowFormModal, reload, setReload, isUpdate, setIsUpdate, stage, setStage }) => {

    const lang = useSelector(state => state.lang.lang)

    const [isSubmit, setIsSubmit] = useState(false)

    const [lead, setLead] = useState()
    const [stageStatus, setStageStatus] = useState(isUpdate ? stage?.stage : '')
    const [note, setNote] = useState(isUpdate ? stage?.note : '')

    const [leadError, setLeadError] = useState()
    const [statusError, setStatusError] = useState()
    const [stageStatusError, setStageStatusError] = useState()
    const [noteError, setNoteError] = useState()
    

    const handleSubmit = (e) => {
        e.preventDefault()
        
        if(!lead) return setLeadError('Lead is required')

        if(!stageStatus) return setStageStatusError('Stage is required')

        const stageData = {
            leadId: lead._id,
            stage: stageStatus,
            note,
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/crm/stages`, stageData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            setReload ? setReload(reload + 1) : null
            setShowFormModal(false)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'leadId') return setLeadError(errorResponse.message)

                if(errorResponse.field === 'stage') return setStageStatusError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {
                toast.error(error.message, { position: 'top-right', duration: 3000 })
            }
        })

    }

    const handleUpdate = (e) => {
        e.preventDefault()

        if(!stageStatus) return setStageStatusError('Stage is required')

        const stageData = {
            stage: stageStatus,
            note,
        }

        setIsSubmit(true)
        serverRequest.put(`/v1/crm/stages/${stage._id}`, stageData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            setReload(reload + 1)
            setStage()
            setIsUpdate(false)
            setShowFormModal(false)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            try {

                const errorResponse = error?.response?.data

                if(errorResponse.field === 'stage') return setStatusError(errorResponse.message)

                toast.error(error?.response?.data?.message, { position: 'top-right', duration: 3000 })

            } catch(error) {
                toast.error(error.message, { position: 'top-right', duration: 3000 })
            }
        })

    }

    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>{isUpdate ? 'Update Stage' : 'Create Stage'}</h2>
            </div>
            <div>
                <div className="modal-body-container">
                    <form 
                    id="stage-form" 
                    className="modal-form-container responsive-form body-text" 
                    onSubmit={isUpdate ? handleUpdate : handleSubmit}>
                        {
                            isUpdate ?
                            <div className="form-input-container">
                                <label>Lead</label>
                                <input 
                                type="text"
                                className="form-input"
                                value={stage?.lead?.name}
                                disabled
                                />
                            </div>
                            :
                            <SearchLeadsInputField 
                            setTargetLead={setLead}
                            setTargetLeadError={setLeadError}
                            targetLeadError={leadError}
                            />
                        }
                        <div className="form-input-container">
                        <label>Stage</label>
                        <select
                        className="form-input"
                        onChange={e => setStageStatus(e.target.value)}
                        onClick={e => setStageStatusError()}
                        >
                            <option disabled selected>Select Stage</option>
                            {leadStages.map(leadStage => {
                                if(leadStage === stageStatus) {
                                    return <option selected value={leadStage}>{capitalizeFirstLetter(leadStage)}</option>
                                }
                                return <option value={leadStage}>{capitalizeFirstLetter(leadStage)}</option>
                            })}
                        </select>
                        <span className="red">{stageStatusError}</span>
                    </div>
                        <div className="form-input-container">
                            <label>Notes</label>
                            <textarea
                            rows={12}
                            value={note}
                            className="form-input"
                            onChange={e => setNote(e.target.value)}
                            onClick={e => setNoteError()}
                            ></textarea>
                            <span className="red">{noteError}</span>
                        </div>
                    </form>
                </div>
                <div className="modal-form-btn-container">
                    <div>   
                        { 
                            isSubmit ?
                            <TailSpin
                            height="25"
                            width="25"
                            color="#4c83ee"
                            />
                            :
                            <button
                            form="stage-form"
                            className="normal-button white-text action-color-bg"
                            >{isUpdate ? 'Update' : 'Create'}</button>
                        } 
                    </div>
                    <div>
                        <button 
                        className="normal-button cancel-button"
                        onClick={e => {
                            e.preventDefault()
                            setIsUpdate ? setIsUpdate() : null
                            setStage ? setStage() : null
                            setShowFormModal(false)
                        }}
                        >{translations[lang]['Close']}</button>
                    </div>
                </div>
            </div>            
        </div>
    </div>
}

export default StageFormModal