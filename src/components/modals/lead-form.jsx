import { useState, useEffect } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { cities } from '../../utils/cities'
import { capitalizeFirstLetter } from '../../utils/formatString'
import { leadStatus, leadStages } from '../../utils/values'

const LeadFormModal = ({ reload, setReload, setShowModalForm, isUpdate, setIsUpdate, lead }) => {

    const [isSubmit, setIsSubmit] = useState(false)

    const [name, setName] = useState(isUpdate ? lead.name : null)
    const [countryCode, setCountryCode] = useState(20)
    const [phone, setPhone] = useState(isUpdate ? lead.phone : null)
    const [gender, setGender] = useState(isUpdate ? lead.gender : 'MALE')
    const [country, setCountry] = useState(isUpdate ? lead.country : 'EGYPT')
    const [city, setCity] = useState(isUpdate ? lead.city : 'ALEXANDRIA')
    const [county, setCounty] = useState(isUpdate ? lead.county : null)
    const [address, setAddress] = useState(isUpdate ? lead.address : null)
    const [value, setValue] = useState(isUpdate ? lead.value : null)
    const [clinicName, setClinicName] = useState(isUpdate ? lead?.clinic?.name : null)
    const [clinicPhone, setClinicPhone] = useState(isUpdate ? lead?.clinic?.phone : null)
    const [note, setNote] = useState(isUpdate ? lead.note : null)
    const [specialities, setSpecialities] = useState([])
    const [speciality, setSpeciality] = useState(isUpdate ? lead?.speciality?._id : null)
    const [status, setStatus] = useState(isUpdate ? lead.status : 'CLOSED')
    const [stage, setStage] = useState(isUpdate ? lead.stage : 'LEAD')

    const [nameError, setNameError] = useState()
    const [countryCodeError, setCountryCodeError] = useState()
    const [phoneError, setPhoneError] = useState()
    const [genderError, setGenderError] = useState()
    const [countryError, setCountryError] = useState()
    const [countyError, setCountyError] = useState()
    const [cityError, setCityError] = useState()
    const [addressError, setAddressError] = useState()
    const [valueError, setValueError] = useState()
    const [clinicNameError, setClinicNameError] = useState()
    const [clinicPhoneError, setClinicPhoneError] = useState()
    const [notesError, setNotesError] = useState([])
    const [specialitiesError, setSpecialitiesError] = useState([])
    const [specialityError, setSpecialityError] = useState()
    const [statusError, setStatusError] = useState()
    const [stageError, setStageError] = useState()


    const genders = ['MALE', 'FEMALE']


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

        if(!name) return setNameError('Name is required')

        const leadData = {
            name,
            countryCode,
            phone: phone ? Number.parseInt(phone) : null,
            gender,
            country,
            city,
            county,
            address,
            value: value ? Number.parseInt(value) : null,
            clinicName,
            clinicPhone: clinicPhone ? Number.parseInt(clinicPhone) : null,
            note,
            specialityId: speciality,
            status,
            stage,
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/crm/leads`, leadData)
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

        if(!name) return setNameError('Name is required')

        const leadData = {
            name,
            countryCode,
            phone: phone ? Number.parseInt(phone) : null,
            gender,
            country,
            city,
            county,
            address,
            value: value ? Number.parseInt(value) : null,
            clinicName,
            clinicPhone: clinicPhone ? Number.parseInt(clinicPhone) : null,
            note,
            specialityId: speciality,
            status,
            stage,
        }

        setIsSubmit(true)
        serverRequest.put(`/v1/crm/leads/${lead._id}`, leadData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            setReload(reload + 1)
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
                <h2>{ isUpdate ? 'Update Lead' : 'Add Lead'}</h2>
            </div>
            <div className="modal-body-container">
                <form 
                id="lead-form" 
                className="modal-form-container responsive-form body-text" 
                onSubmit={isUpdate ? handleUpdate : handleSubmit}
                >
                    <div className="form-input-container">
                        <label>Name</label>
                        <input 
                        type="text" 
                        className="form-input" 
                        placeholder=""
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onClick={e => setNameError()}
                        />
                        <span className="red">{nameError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Phone</label>
                        <input 
                        type="tel"
                        className="form-input" 
                        placeholder=""
                        value={phone} 
                        onChange={e => setPhone(e.target.value)}
                        onClick={e => setPhoneError()}
                        />
                        <span className="red">{phoneError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Gender</label>
                        <select 
                        name="gender" 
                        id="gender"
                        onChange={e => setGender(e.target.value)}
                        onClick={e => setGenderError()}
                        >
                            {genders.map(tempGender => {
                                if(tempGender === gender) {
                                    return <option selected value={tempGender}>{capitalizeFirstLetter(tempGender)}</option>
                                }

                                return <option value={tempGender}>{capitalizeFirstLetter(tempGender)}</option>
                            })}
                        </select>
                        <span className="red">{genderError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Address</label>
                        <input 
                        type="text" 
                        className="form-input" 
                        placeholder=""
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        onClick={e => setAddressError()}
                        />
                        <span className="red">{addressError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Value</label>
                        <input 
                        type="number" 
                        className="form-input" 
                        placeholder=""
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        onClick={e => setValueError()}
                        />
                        <span className="red">{valueError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Clinic Name</label>
                        <input 
                        type="text" 
                        className="form-input" 
                        placeholder=""
                        value={clinicName}
                        onChange={e => setClinicName(e.target.value)}
                        onClick={e => setClinicNameError()}
                        />
                        <span className="red">{clinicNameError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Clinic Phone</label>
                        <input 
                        type="tel" 
                        className="form-input" 
                        placeholder=""
                        value={clinicPhone}
                        onChange={e => setClinicPhone(e.target.value)}
                        onClick={e => setClinicPhoneError()}
                        />
                        <span className="red">{clinicPhoneError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Speciality</label>
                        <select
                        className="form-input"
                        onChange={e => setSpeciality(e.target.value)}
                        onClick={e => setSpecialitiesError()}
                        >
                            <option selected disabled>select speciality</option>
                            {specialities.map(special => {
                                if(special._id === lead?.specialityId) {
                                    return <option selected value={special._id}>{special.name}</option>
                                }

                                return <option value={special._id}>{special.name}</option>
                            })}
                        </select>
                        <span className="red">{specialitiesError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Status</label>
                        <select
                        className="form-input"
                        onChange={e => setStatus(e.target.value)}
                        onClick={e => setStatusError()}
                        >
                            {leadStatus.map(leadState => {
                                if(leadState === status) {
                                    return <option selected value={leadState}>{capitalizeFirstLetter(leadState)}</option>
                                }
                                return <option value={leadState}>{capitalizeFirstLetter(leadState)}</option>
                            })}
                        </select>
                        <span className="red">{statusError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Stage</label>
                        <select
                        className="form-input"
                        onChange={e => setStage(e.target.value)}
                        onClick={e => setStageError()}
                        >
                            {leadStages.map(leadStage => {
                                if(leadStage === stage) {
                                    return <option selected value={leadStage}>{capitalizeFirstLetter(leadStage)}</option>
                                }
                                return <option value={leadStage}>{capitalizeFirstLetter(leadStage)}</option>
                            })}
                        </select>
                        <span className="red">{stageError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Notes</label>
                        <textarea
                        rows={4}
                        value={note}
                        className="form-input"
                        onChange={e => setNote(e.target.value)}
                        onClick={e => setNoteError()}
                        ></textarea>
                        <span className="red">{notesError}</span>
                        
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
                        form="lead-form"
                        className="normal-button white-text action-color-bg"
                        >{isUpdate ? 'Update' : 'Create'}</button>
                    }
                </div>
                <div>
                    <button 
                    className="normal-button cancel-button"
                    onClick={e => {
                        setShowModalForm(false)
                        setIsUpdate ? setIsUpdate(false) : null
                    }}
                    >Close</button>
                </div>
            </div>
        </div>
    </div>
}

export default LeadFormModal