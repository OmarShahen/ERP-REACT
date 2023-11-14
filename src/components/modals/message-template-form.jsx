import { useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { useSelector } from 'react-redux'
import translations from '../../i18n'
import { capitalizeFirstLetter } from '../../utils/formatString'
import { MessagesTemplatesCategories } from '../../utils/values'


const MessageTemplateFormModal = ({ setShowFormModal, reload, setReload, isUpdate, setIsUpdate, message, setMessage }) => {

    const lang = useSelector(state => state.lang.lang)

    const [isSubmit, setIsSubmit] = useState(false)

    const [name, setName] = useState(isUpdate ? message.name : '')
    const [description, setDescription] = useState(isUpdate ? message.description : '')
    const [category, setCategory] = useState(isUpdate ? message.category : '')

    const [nameError, setNameError] = useState()
    const [descriptionError, setDescriptionError] = useState()
    const [categoryError, setCategoryError] = useState()
    

    const handleSubmit = (e) => {
        e.preventDefault()
        
        if(!name) return setNameError('Name is required')

        if(!category) return setCategoryError('Category is required')

        if(!description) return setDescriptionError('Description is required')

        const messageData = {
            name,
            category,
            description
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/crm/messages-templates`, messageData)
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

                if(errorResponse.field === 'name') return setNameError(errorResponse.message)

                if(errorResponse.field === 'category') return setCategoryError(errorResponse.message)

                if(errorResponse.field === 'description') return setDescriptionError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {
                toast.error(error.message, { position: 'top-right', duration: 3000 })
            }
        })

    }

    const handleUpdate = (e) => {
        e.preventDefault()
        
        if(!name) return setNameError('Name is required')

        if(!category) return setCategoryError('Category is required')

        if(!description) return setDescriptionError('Description is required')

        const messageData = {
            name,
            category,
            description
        }

        setIsSubmit(true)
        serverRequest.put(`/v1/crm/messages-templates/${message._id}`, messageData)
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

                if(errorResponse.field === 'name') return setNameError(errorResponse.message)

                if(errorResponse.field === 'category') return setCategoryError(errorResponse.message)

                if(errorResponse.field === 'description') return setDescriptionError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {
                toast.error(error.message, { position: 'top-right', duration: 3000 })
            }
        })

    }

    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>{isUpdate ? 'Update Message' : 'Create Message'}</h2>
            </div>
            <div>
                <div className="modal-body-container">
                    <form 
                    id="message-form" 
                    className="modal-form-container responsive-form body-text" 
                    onSubmit={isUpdate ? handleUpdate : handleSubmit}>
                        <div className="form-input-container">
                            <label>Name</label>
                            <input 
                            type="text"
                            className="form-input"
                            onClick={e => setNameError()}
                            onChange={e => setName(e.target.value)}
                            value={name}
                            />
                            <span className="red">{nameError}</span>
                        </div>
                        <div className="form-input-container">
                            <label>Category</label>
                            <select
                            className="form-input"
                            onChange={e => setCategory(e.target.value)}
                            onClick={e => setCategoryError()}
                            >
                                <option disabled selected>Select Category</option>
                                {MessagesTemplatesCategories.map(messageCategory => {
                                    if(messageCategory === category) {
                                        return <option selected value={messageCategory}>{capitalizeFirstLetter(messageCategory)}</option>
                                    }
                                    return <option value={messageCategory}>{capitalizeFirstLetter(messageCategory)}</option>
                                })}
                            </select>
                            <span className="red">{categoryError}</span>
                        </div>
                        <div className="form-input-container">
                            <label>Description</label>
                            <textarea
                            rows={12}
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
                            <TailSpin
                            height="25"
                            width="25"
                            color="#4c83ee"
                            />
                            :
                            <button
                            form="message-form"
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
                            setMessage ? setMessage() : null
                            setShowFormModal(false)
                        }}
                        >{translations[lang]['Close']}</button>
                    </div>
                </div>
            </div>            
        </div>
    </div>
}


export default MessageTemplateFormModal