import { useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { useSelector, useDispatch } from 'react-redux'
import translations from '../../i18n'


const ServiceFormModal = ({ 
    setShowFormModal, 
    reload, 
    setReload, 
    service, 
    setService,
    setIsUpdate,
    isUpdate
}) => {

    const pagePath = window.location.pathname
    const expertId = pagePath.split('/')[2]

    const lang = useSelector(state => state.lang.lang)

    const [isSubmit, setIsSubmit] = useState(false)

    const [title, setTitle] = useState(isUpdate ? service.title : '')
    const [description, setDescription] = useState(isUpdate ? service.description : '')
    const [duration, setDuration] = useState(isUpdate ? service.duration : '')
    const [price, setPrice] = useState(isUpdate ? service.price : '')
    const [internationalPrice, setInternationalPrice] = useState(isUpdate ? service.internationalPrice : '')

    const [titleError, setTitleError] = useState()
    const [descriptionError, setDescriptionError] = useState()
    const [durationError, setDurationError] = useState()
    const [priceError, setPriceError] = useState()
    const [internationalPriceError, setInternationalPriceError] = useState()


    const handleSubmit = (e) => {
        e.preventDefault()

        if(!title) return setTitleError('Title is required')

        if(!duration) return setDurationError('Duration is required')

        if(!price) return setPriceError('Price is required')

        if(!internationalPrice) return setInternationalPriceError('International price is required')

        if(!description) return setDescriptionError('Description is required')

        const service = {
            expertId,
            title,
            description,
            duration: Number.parseInt(duration),
            price: Number.parseInt(price),
            internationalPrice: Number.parseInt(internationalPrice),
            isActive: true
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/services`, service)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            setReload(reload + 1)
            setShowFormModal(false)
            toast.success(data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'title') return setTitleError(errorResponse.message)

                if(errorResponse.field === 'duration') return setDurationError(errorResponse.message)

                if(errorResponse.field === 'price') return setPriceError(errorResponse.message)

                if(errorResponse.field === 'internationalPrice') return setInternationalPriceError(errorResponse.message)

                if(errorResponse.field === 'description') return setDescriptionError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }

    const handleUpdate = (e) => {
        e.preventDefault()

        if(!title) return setTitleError('Title is required')

        if(!duration) return setDurationError('Duration is required')

        if(!price) return setPriceError('Price is required')

        if(!internationalPrice) return setInternationalPriceError('International price is required')

        if(!description) return setDescriptionError('Description is required')

        const serviceData = {
            title,
            description,
            duration: Number.parseInt(duration),
            price: Number.parseInt(price),
            internationalPrice: Number.parseInt(internationalPrice),
        }

        setIsSubmit(true)
        serverRequest.put(`/v1/services/${service._id}`, serviceData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            setReload(reload + 1)
            setShowFormModal(false)
            setIsUpdate(false)
            setService({})
            toast.success(data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'title') return setTitleError(errorResponse.message)

                if(errorResponse.field === 'duration') return setDurationError(errorResponse.message)

                if(errorResponse.field === 'price') return setPriceError(errorResponse.message)

                if(errorResponse.field === 'internationalPrice') return setInternationalPriceError(errorResponse.message)

                if(errorResponse.field === 'description') return setDescriptionError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }


    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>{ isUpdate ? translations[lang]['Update Service'] : translations[lang]['Create Service']}</h2>
            </div>                
            <div className="modal-body-container">
                    <form 
                    id="service-form" 
                    className="modal-form-container responsive-form body-text" 
                    onSubmit={isUpdate ? handleUpdate : handleSubmit}
                    >
                        <div className="form-input-container">
                            <label>Title</label>
                            <input 
                            type="text" 
                            className="form-input" 
                            placeholder=""
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            onClick={e => setTitleError()}
                            />
                            <span className="red">{titleError}</span>
                        </div>
                        <div className="form-input-container">
                            <label>Duration (minutes)</label>
                            <input 
                            type="number" 
                            className="form-input" 
                            placeholder=""
                            value={duration}
                            onChange={e => setDuration(e.target.value)}
                            onClick={e => setDurationError()}
                            />
                            <span className="red">{durationError}</span>
                        </div>
                        <div className="form-input-container">
                            <label>Price (EGP)</label>
                            <input 
                            type="number" 
                            className="form-input" 
                            placeholder=""
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            onClick={e => setPriceError()}
                            />
                            <span className="red">{priceError}</span>
                        </div>                       
                        <div className="form-input-container">
                            <label>International Price (EGP)</label>
                            <input 
                            type="number" 
                            className="form-input" 
                            placeholder=""
                            value={internationalPrice}
                            onChange={e => setInternationalPrice(e.target.value)}
                            onClick={e => setInternationalPriceError()}
                            />
                            <span className="red">{internationalPriceError}</span>
                        </div>                                           
                    </form>
                    <div className="form-input-container">
                        <label>Description</label>
                        <textarea
                        rows={7}
                        value={description}
                        className="form-input"
                        onChange={e => setDescription(e.target.value)}
                        onClick={e => setDescriptionError()}
                        >

                        </textarea>
                        <span className="red">{descriptionError}</span>
                    </div>
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
                        form="service-form"
                        className="normal-button white-text action-color-bg"
                        >{isUpdate ? translations[lang]['Update']  : translations[lang]['Create'] }</button>
                    } 
                </div>
                <div>
                    <button 
                    className="normal-button cancel-button"
                    onClick={e => {
                        e.preventDefault()
                        setService ? setService({}) : null
                        setIsUpdate(false)
                        setShowFormModal(false)
                    }}
                    >{translations[lang]['Close']}</button>
                </div>
            </div>
        </div>
    </div>
}

export default ServiceFormModal