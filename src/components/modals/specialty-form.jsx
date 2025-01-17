import { useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import CardTransition from '../transitions/card-transitions'


const SpecialtyFormModal = ({ setShowFormModal, specialtyId, reload, setReload, isUpdate, setIsUpdate, specialty, setSpecialty, type }) => {

    const [isSubmit, setIsSubmit] = useState(false)

    const [name, setName] = useState(isUpdate ? specialty?.name : '')
    const [imageURL, setImageURL] = useState(isUpdate ? specialty?.imageURL : '')

    const [nameError, setNameError] = useState()
    const [imageURLError, setImageURLError] = useState()
    

    const handleSubmit = (e) => {
        e.preventDefault()
        
        if(!name) return setNameError('اسم الفئة مطلوب')

        //if(!imageURL) return setImageURLError('Image URL is required')

        const specialtyData = {
            name,
            type,
            imageURL
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
        
        if(!name) return setNameError('اسم الفئة مطلوب')

        //if(!imageURL) return setImageURLError('Image URL is required')

        const specialtyData = {
            name,
            imageURL
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
        <CardTransition>
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>{isUpdate ? 'تحديث الفئة' : 'اضافة فئة'}</h2>
            </div>
            <div>
                <div className="modal-body-container">
                    <form 
                    id="value-form" 
                    className="modal-form-container responsive-form body-text right-direction" 
                    onSubmit={isUpdate ? handleUpdate : handleSubmit}>
                        
                        <div className="form-input-container">
                            <label>الاسم</label>
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
                            >{isUpdate ? 'تحديث' : 'اضافة'}</button>
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
                        >الغاء</button>
                    </div>
                </div>
            </div>            
        </div>
        </CardTransition>
    </div>
}


export default SpecialtyFormModal