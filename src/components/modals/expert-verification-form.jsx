import { useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { capitalizeFirstLetter } from '../../utils/formatString'

const ExpertVerificationFormModal = ({ reload, setReload, setShowModalForm, isUpdate, setIsUpdate, expertVerification }) => {

    const [isSubmit, setIsSubmit] = useState(false)

    const [name, setName] = useState(expertVerification.name)
    const [email, setEmail] = useState(expertVerification.email)
    const [phone, setPhone] = useState(`+${expertVerification.countryCode}${expertVerification.phone}`)
    const [status, setStatus] = useState(expertVerification.status)
    const [speciality, setSpeciality] = useState(expertVerification.speciality.name)
    const [description, setDescription] = useState(expertVerification.description)
    const [websiteURL, setWebsiteURL] = useState(expertVerification.websiteURL)
    const [facebookURL, setFacebookURL] = useState(expertVerification.facebookURL)
    const [tiktokURL, setTiktokURL] = useState(expertVerification.tiktokURL)
    const [instagramURL, setInstagramURL] = useState(expertVerification.instagramURL)
    const [youtubeURL, setYoutubeURL] = useState(expertVerification.youtubeURL)
    const [linkedInURL, setLinkedInURL] = useState(expertVerification.linkedInURL)
    
    const [nameError, setNameError] = useState()
    const [emailError, setEmailError] = useState()
    const [phoneError, setPhoneError] = useState()
    const [statusError, setStatusError] = useState()
    const [specialityError, setSpecialityError] = useState()
    const [descriptionError, setDescriptionError] = useState()
    
    const handleSubmit = (e) => {
        e.preventDefault()
        setIsSubmit(true)
        serverRequest.patch(`/v1/experts-verifications/${expertVerification._id}/status`, { status })
        .then(response => {
            setIsSubmit(false)
            setReload(reload + 1)
            setShowModalForm(false)
            toast.success(response.data.message, { duration:3000, position: 'top-right' })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }

    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>Expert Verification #{expertVerification.expertVerificationId}</h2>
            </div>
            <div className="modal-body-container">
                <form 
                id="lead-form" 
                className="modal-form-container responsive-form body-text" 
                onSubmit={handleSubmit}
                >
                    <div className="form-input-container">
                        <label>Name</label>
                        <input 
                        type="text" 
                        disabled
                        className="form-input" 
                        placeholder=""
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onClick={e => setNameError()}
                        />
                        <span className="red">{nameError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Email</label>
                        <input 
                        type="email"
                        disabled 
                        className="form-input" 
                        placeholder=""
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onClick={e => setEmailError()}
                        />
                        <span className="red">{emailError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Phone</label>
                        <input 
                        type="tel"
                        disabled
                        className="form-input" 
                        placeholder=""
                        value={phone} 
                        onChange={e => setPhone(e.target.value)}
                        onClick={e => setPhoneError()}
                        />
                        <span className="red">{phoneError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Speciality</label>
                        <input 
                        type="text"
                        disabled
                        className="form-input" 
                        placeholder=""
                        value={speciality} 
                        onChange={e => setSpeciality(e.target.value)}
                        onClick={e => setSpecialityError()}
                        />
                        <span className="red">{specialityError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Status</label>
                        <select
                        className="form-input"
                        onChange={e => setStatus(e.target.value)}
                        onClick={e => setStatusError()}
                        >
                            {['ACCEPTED', 'PENDING', 'REJECTED'].map(expertStatus => {
                                if(expertStatus === status) {
                                    return <option selected value={expertStatus}>{capitalizeFirstLetter(expertStatus)}</option>
                                }
                                return <option value={expertStatus}>{capitalizeFirstLetter(expertStatus)}</option>
                            })}
                        </select>
                        <span className="red">{statusError}</span>
                    </div>
                    {
                        websiteURL ?
                        <div className="form-input-container">
                            <label>Website</label>
                            <a className="button center" target='_blank' href={websiteURL}>View Link</a>
                        </div>
                        :
                        null
                    }
                    {
                        facebookURL ?
                        <div className="form-input-container">
                            <label>Facebook</label>
                            <a className="button center" target='_blank' href={facebookURL}>View Link</a>
                        </div>
                        :
                        null
                    }
                    {
                        tiktokURL ?
                        <div className="form-input-container">
                            <label>Tiktok</label>
                            <a className="button center" target='_blank' href={tiktokURL}>View Link</a>
                        </div>
                        :
                        null
                    }
                    {
                        instagramURL ?
                        <div className="form-input-container">
                            <label>Instagram</label>
                            <a className="button center" target='_blank' href={instagramURL}>View Link</a>
                        </div>
                        :
                        null
                    }
                    {
                        youtubeURL ?
                        <div className="form-input-container">
                            <label>Youtube</label>
                            <a className="button center" target='_blank' href={youtubeURL}>View Link</a>
                        </div>
                        :
                        null
                    }
                    {
                        linkedInURL ?
                        <div className="form-input-container">
                            <label>Linked In</label>
                            <a className="button center" target='_blank' href={linkedInURL}>View Link</a>
                        </div>
                        :
                        null
                    }
                </form>
                <div className="form-input-container">
                    <label>Description</label>
                    <textarea
                    disabled
                    rows={7}
                    value={description}
                    className="form-input"
                    onChange={e => setDescription(e.target.value)}
                    onClick={e => setDescriptionError()}
                    ></textarea>
                    <span className="red">{descriptionError}</span>
                    
                </div>
            </div>
            <div className="modal-form-btn-container">
                <div>
                    {
                        isSubmit ?
                        <TailSpin width="25" height="25" color="#4c83ee" />
                        :
                        <button 
                        form="lead-form"
                        className="normal-button white-text action-color-bg"
                        >Update Status</button>
                    }
                </div>
                <div>
                    <button 
                    className="normal-button cancel-button"
                    onClick={e => {
                        setShowModalForm(false)
                    }}
                    >Close</button>
                </div>
            </div>
        </div>
    </div>
}

export default ExpertVerificationFormModal