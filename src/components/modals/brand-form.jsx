import { useState, useEffect } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { format } from 'date-fns'


const BrandFormModal = ({ reload, setReload, setShowModalForm, isUpdate, setIsUpdate, brand, setBrand }) => {

    const [isSubmit, setIsSubmit] = useState(false)

    const [name, setName] = useState(brand ? brand.name : '')
    const [speciality, setSpeciality] = useState(brand ? brand.categoryId : '')
    const [specialities, setSpecialities] = useState([])

    const [nameError, setNameError] = useState()
    const [specialitiesError, setSpecialitiesError] = useState()

    useEffect(() => {
        serverRequest.get('/v1/specialities')
        .then(response => {
            setSpecialities(response.data.specialities)
        })
        .catch(error => {
            console.error(error)
        })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!name) return setNameError('Brand is required')

        if(!speciality) return setSpecialitiesError('Category is required')

        const brandData = {
            name,
            categoryId: speciality
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/brands`, brandData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            setReload(reload + 1)
            setShowModalForm(false)
            toast.success(data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            
            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'name') return setNameError(errorResponse.message)

                if(errorResponse.field === 'categoryId') return setSpecialitiesError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }

    const handleUpdate = (e) => {
        e.preventDefault()

        if(!name) return setNameError('Brand is required')

        const brandData = { name }

        setIsSubmit(true)
        serverRequest.put(`/v1/brands/${brand._id}`, brandData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            setReload(reload + 1)
            setShowModalForm(false)
            setBrand()
            toast.success(data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            
            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'name') return setNameError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }

    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>{ brand ? 'Update Brand' : 'Add Brand'}</h2>
            </div>
            <div className="modal-body-container">
                <form 
                id="patient-form" 
                className="modal-form-container responsive-form body-text" 
                onSubmit={brand ? handleUpdate : handleSubmit}
                >
                    <div className="form-input-container">
                        <label>Brand</label>
                        <input 
                        type="text" 
                        className="form-input" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onClick={e => setNameError()}
                        />
                        <span className="red">{nameError}</span>
                    </div>
                    {
                        brand ?
                        <div className="form-input-container">
                            <label>Category</label>
                            <input 
                            type="text" 
                            className="form-input"
                            value={brand?.category?.name}
                            disabled
                            />
                        </div>
                        :
                        <div className="form-input-container">
                            <label>Category</label>
                            <select
                            onClick={() => setSpecialitiesError()}
                            onChange={e => setSpeciality(e.target.value)}
                            >
                                <option disabled selected>Select Category</option>
                                {specialities.map(special => {
                                    if(special._id === speciality) {
                                        return <option selected value={special._id}>{special.name}</option>
                                    }
                                    return <option value={special._id}>{special.name}</option>
                                })}
                            </select>
                            <span className="red">{specialitiesError}</span>
                    </div>
                    }
                </form>
            </div>
            <div className="modal-form-btn-container">
                <div>
                    {
                        isSubmit ?
                        <TailSpin width="25" height="25" color="#4c83ee" />
                        :
                        <button 
                        form="patient-form"
                        className="normal-button white-text action-color-bg"
                        >{brand ? 'Update' : 'Create'}</button>
                    }
                </div>
                <div>
                    <button 
                    className="normal-button cancel-button"
                    onClick={e => {
                        setShowModalForm(false)
                        setBrand()
                    }}
                    >Close</button>
                </div>
            </div>
        </div>
    </div>
}


export default BrandFormModal