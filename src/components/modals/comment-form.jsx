import { useState, useEffect } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { capitalizeFirstLetter } from '../../utils/formatString'
import { useSelector } from 'react-redux'


const CommentFormModal = ({ reload, setReload, setShowModalForm, isUpdate=false, setIsUpdate, comment }) => {

    const user = useSelector(state => state.user.user)

    const [clinics, setClinics] = useState([])
    const [clinic, setClinic] = useState()
    const [isSubmit, setIsSubmit] = useState(false)

    const [description, setDescription] = useState(isUpdate ? comment.description : null)
    const [type, setType] = useState(isUpdate ? comment.type : 'ISSUE')
    const [category, setCategory] = useState('ISSUE')
    
    const [descriptionError, setDescriptionError] = useState()
    const [typeError, setTypeError] = useState()
    const [categoryError, setCategoryError] = useState()

    const [clinicError, setClinicError] = useState()

    const types = ['ISSUE', 'COMPLIMENT']
    
    useEffect(() => {

        serverRequest.get(`/v1/clinics/followup-service/clinics-subscriptions/active`)
        .then(response => {
            const data = response.data
            setClinics(data.clinics)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!description) return setDescriptionError('description is required')

        if(!clinic) return setClinicError('clinic is required')

        const commentData = {
            clinicId: clinic,
            description,
            memberId: user._id,
            type,
            category: 'ISSUE'
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/comments`, commentData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            reload ? setReload(reload + 1) : null
            setShowModalForm(false)
            toast.success(data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            
            try {

                const errorResponse = error.response.data

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }

    const handleUpdate = (e) => {
        e.preventDefault()

        if(!description) return setDescriptionError('description is required')

        const commentData = {
            description,
            type,
            category: 'ISSUE'
        }

        setIsSubmit(true)
        serverRequest.put(`/v1/comments/${comment._id}`, commentData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            reload ? setReload(reload + 1) : null
            setIsUpdate(false)
            setShowModalForm(false)
            toast.success(data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            
            try {

                const errorResponse = error.response.data

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }


    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>{ isUpdate ? 'Update Comment' : 'Add Comment'}</h2>
            </div>
            <div className="modal-body-container">
                <form 
                id="comment-form" 
                className="modal-form-container responsive-form body-text" 
                onSubmit={isUpdate ? handleUpdate : handleSubmit}
                >
                    <div className="form-input-container">
                        <label>Type</label>
                        <select
                        className="form-input"
                        onClick={e => setTypeError()}
                        onChange={e => setType(e.target.value)}
                        >
                            {types.map(tempType => {
                                if(tempType === type) {
                                    return <option value={tempType} selected>{capitalizeFirstLetter(tempType)}</option>
                                }
                                return <option value={tempType}>{capitalizeFirstLetter(tempType)}</option>
                            })}
                        </select>
                        <span className="red">{typeError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Clinic</label>
                        {
                            isUpdate ?
                            <input 
                            type="text" 
                            disabled
                            value={comment?.clinic?.name} 
                            className="form-input" 
                            />
                            :
                            <select 
                            className="form-input"
                            onClick={e => setClinicError()}
                            onChange={e => setClinic(e.target.value)}
                            >
                                <option selected disabled>Choose Clinic</option>
                                {clinics.map(clinic => <option value={clinic._id}>{clinic.name}</option>)}
                            </select>   
                        }
                        <span className="red">{clinicError}</span>
                    </div>
                    <div className="form-input-container-full-width margin-top-1">
                        <label>Description</label>
                        <textarea
                        rows={7}
                        value={description}
                        className="form-input"
                        onChange={e => setDescription(e.target.value)}
                        onClick={e => setDescriptionError()}
                        ></textarea>
                        <span className="red">{descriptionError}</span>
                    </div>
                </form>
            </div>
            <div className="modal-form-btn-container">
                <div>
                    {
                        isSubmit ?
                        <TailSpin width="25" height="25" color="#4c83ee" />
                        :
                        <button 
                        form="comment-form"
                        className="normal-button white-text action-color-bg"
                        >{isUpdate ? 'Update' : 'Create'}</button>
                    }
                </div>
                <div>
                    <button 
                    className="normal-button cancel-button"
                    onClick={e => {
                        setShowModalForm(false)
                        setIsUpdate(false)
                    }}
                    >Close</button>
                </div>
            </div>
        </div>
    </div>
}

export default CommentFormModal