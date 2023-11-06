import { useState, useEffect } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { getBirthYearByAge, getAge } from '../../utils/age-calculator'
import { useNavigate } from 'react-router-dom'
import { TailSpin } from 'react-loader-spinner'
import { useSelector } from 'react-redux'
import { cities } from '../../utils/cities'
import { capitalizeFirstLetter } from '../../utils/formatString'


const PatientFormModal = ({ reload, setReload, setShowModalForm, isUpdate, setIsUpdate, patient }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)

    const [isSubmit, setIsSubmit] = useState(false)

    const [clinics, setClinics] = useState([])

    const [name, setName] = useState(isUpdate ? `${patient?.patient?.firstName}` : '')
    const [lastName, setLastName] = useState(isUpdate ? patient?.patient?.lastName : null)
    const [countryCode, setCountryCode] = useState(20)
    const [phone, setPhone] = useState(isUpdate ? patient?.patient?.phone : '')
    const [gender, setGender] = useState(isUpdate ? patient?.patient?.gender : "MALE")
    const [age, setAge] = useState(isUpdate ? getAge(patient?.patient?.dateOfBirth) : '')
    const [city, setCity] = useState(isUpdate ? patient?.patient?.city : 'ALEXANDRIA')
    const [country, setCountry] = useState()
    const [lastVisitDate, setLastVisitDate] = useState()
    const [service, setService] = useState()
    const [clinic, setClinic] = useState(isUpdate ? patient.clinicId : '')


    const [nameError, setNameError] = useState()
    const [lastNameError, setLastNameError] = useState()
    const [countryCodeError, setCountryCodeError] = useState()
    const [phoneError, setPhoneError] = useState()
    const [genderError, setGenderError] = useState()
    const [ageError, setAgeError] = useState()
    const [cityError, setCityError] = useState()
    const [countryError, setCountryError] = useState()
    const [lastVisitDateError, setLastVisitDateError] = useState()
    const [serviceError, setServiceError] = useState()
    const [clinicError, setClinicError] = useState()

    const genders = ['MALE', 'FEMALE']

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

        if(!name) return setNameError('Name is required')

        if(!clinic) return setClinicError('Clinic is required')
        
        if(!phone) return setPhoneError('Phone is required')

        if(!gender) return setGenderError('Gender is required')

        if(!city) return setCityError('City is required')

        const patientData = {
            clinicId: clinic,
            firstName: name,
            countryCode: 20,
            phone: Number.parseInt(phone),
            gender,
            city,
            country: 'EGYPT',
            lastVisitDate,
        }

        if(age) {
            patientData.dateOfBirth = String(getBirthYearByAge(age))
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/patients`, patientData)
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

                if(errorResponse.field === 'firstName') return setNameError(errorResponse.message)

                if(errorResponse.field === 'lastName') return setNameError(errorResponse.message)

                if(errorResponse.field === 'phone') return setPhoneError(errorResponse.message)

                if(errorResponse.field === 'gender') return setGenderError(errorResponse.message)

                if(errorResponse.field === 'dateOfBirth') return setAgeError(errorResponse.message)

                if(errorResponse.field === 'city') return setCityError(errorResponse.message)

                if(errorResponse.field === 'lastVisitDate') return setLastVisitDateError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }

    const handleUpdate = (e) => {
        e.preventDefault()

        if(!name) return setNameError('Name is required')
        
        if(!phone) return setPhoneError('Phone is required')

        if(!gender) return setGenderError('Gender is required')

        if(!city) return setCityError('City is required')

        const patientData = {
            firstName: name,
            lastName,
            countryCode: 20,
            phone: Number.parseInt(phone),
            gender,
            city,
            country: 'EGYPT'
        }

        if(age) {
            patientData.dateOfBirth = String(getBirthYearByAge(age))
        }

        setIsSubmit(true)
        serverRequest.put(`/v1/patients/${patient.patientId}`, patientData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            setReload(reload + 1)
            setShowModalForm(false)
            setIsUpdate(false)
            toast.success(data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            
            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'firstName') return setNameError(errorResponse.message)

                if(errorResponse.field === 'lastName') return setNameError(errorResponse.message)

                if(errorResponse.field === 'phone') return setPhoneError(errorResponse.message)

                if(errorResponse.field === 'gender') return setGenderError(errorResponse.message)

                if(errorResponse.field === 'dateOfBirth') return setAgeError(errorResponse.message)

                if(errorResponse.field === 'city') return setCityError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }

    const resetForm  = () => {

        setFirstName('')
        setLastName('')
        setCountryCode(20)
        setPhone(0)
        setGender("MALE")
        setAge(0)
        setCardId('')

        setFirstNameError()
        setLastNameError()
        setCountryCodeError()
        setPhoneError()
        setGenderError()
        setAgeError()
        setCardIdError()
    }

    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>{ isUpdate ? 'Update Patient' : 'Add Patient'}</h2>
            </div>
            <div className="modal-body-container">
                <form 
                id="patient-form" 
                className="modal-form-container responsive-form body-text" 
                onSubmit={isUpdate ? handleUpdate : handleSubmit}
                >
                    <div className="form-input-container">
                        <label>Name*</label>
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
                    {
                        isUpdate && patient?.patient?.lastName ?
                        <div className="form-input-container">
                            <label>Last Name</label>
                            <input 
                            type="text" 
                            className="form-input" 
                            placeholder=""
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            onClick={e => setLastNameError()}
                            />
                            <span className="red">{lastNameError}</span>
                        </div>
                        :
                        null
                    }
                    {
                        !isUpdate ?
                        <div className="form-input-container">
                            <label>Clinic*</label>
                            <select 
                            className="form-input"
                            onClick={e => setClinicError()}
                            onChange={e => setClinic(e.target.value)}
                            >
                                <option selected disabled>Choose Clinic</option>
                                {clinics.map(clinic => <option value={clinic._id}>{clinic.name}</option>)}
                            </select>
                            <span className="red">{clinicError}</span>
                        </div>
                        :
                        null
                    }
                    <div className="form-input-container">
                        <label>Phone*</label>
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
                        <label>Gender*</label>
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
                        <label>Age</label>
                        <input 
                        type="number"
                        min="1"
                        className="form-input" 
                        placeholder=""
                        value={age} 
                        onChange={e => setAge(e.target.value)}
                        onClick={e => setAgeError()}
                        />
                        <span className="red">{ageError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>City*</label>
                        <select
                        className="form-input"
                        onClick={e => setCityError()}
                        onChange={e => setCity(e.target.value)}
                        >
                            {cities.map(tempCity => {

                                if(tempCity === city) {
                                    return <option selected value={tempCity}>{capitalizeFirstLetter(tempCity)}</option>
                                }

                                return <option value={tempCity}>{capitalizeFirstLetter(tempCity)}</option>
                            })}
                        </select>
                        <span className="red">{cityError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Last Visit</label>
                        <input 
                        type="date"
                        className="form-input" 
                        value={lastVisitDate} 
                        onChange={e => setLastVisitDate(e.target.value)}
                        onClick={e => setLastVisitDateError()}
                        />
                        <span className="red">{lastVisitDateError}</span>
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
                        form="patient-form"
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

export default PatientFormModal