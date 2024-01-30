import { useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { useSelector } from 'react-redux'
import translations from '../../i18n'


const SpecialtyFormModal = ({ setShowFormModal, specialtyId, reload, setReload, isUpdate, setIsUpdate, specialty, setSpecialty, type }) => {

    const lang = useSelector(state => state.lang.lang)

    const [isSubmit, setIsSubmit] = useState(false)

    const [name, setName] = useState(isUpdate ? specialty?.name : '')

    const [nameError, setNameError] = useState()
    

    const handleSubmit = (e) => {
        e.preventDefault()
        
        if(!name) return setNameError('Name is required')

        const specialtyData = {
            name,
            type
        }

        if(type === 'SUB') {
            specialtyData.mainSpecialityId = specialtyId
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/specialities`, specialtyData)
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

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {
                toast.error(error.message, { position: 'top-right', duration: 3000 })
            }
        })

    }

    const handleUpdate = (e) => {
        e.preventDefault()
        
        if(!name) return setNameError('Name is required')

        const specialtyData = {
            name,
        }

        setIsSubmit(true)
        serverRequest.put(`/v1/specialities/${specialty._id}`, specialtyData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            setReload ? setReload(reload + 1) : null
            setSpecialty()
            setIsUpdate(false)
            setShowFormModal(false)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'name') return setNameError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {
                toast.error(error.message, { position: 'top-right', duration: 3000 })
            }
        })

    }

    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>{isUpdate ? 'Update Specialty' : 'Create Specialty'}</h2>
            </div>
            <div>
                <div className="modal-body-container">
                    <form 
                    id="value-form" 
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
                            form="value-form"
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
                            setSpecialty ? setSpecialty() : null
                            setShowFormModal(false)
                        }}
                        >{translations[lang]['Close']}</button>
                    </div>
                </div>
            </div>            
        </div>
    </div>
}


export default SpecialtyFormModal