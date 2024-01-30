import { useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { capitalizeFirstLetter } from '../../utils/formatString'


const ExpertFormModal = ({ reload, setReload, setShowModalForm, isUpdate, setIsUpdate, expert }) => {

    const [isSubmit, setIsSubmit] = useState(false)

    const [name, setName] = useState(isUpdate ? expert.firstName : null)
    const [countryCode, setCountryCode] = useState(20)
    const [email, setEmail] = useState(isUpdate ? expert.email : null)
    const [password, setPassword] = useState()
    const [phone, setPhone] = useState(isUpdate ? expert.phone : null)
    const [gender, setGender] = useState(isUpdate ? expert.gender : 'MALE')
    

    const [nameError, setNameError] = useState()
    const [emailError, setEmailError] = useState()
    const [passwordError, setPasswordError] = useState()
    const [countryCodeError, setCountryCodeError] = useState()
    const [phoneError, setPhoneError] = useState()
    const [genderError, setGenderError] = useState()


    const genders = ['MALE', 'FEMALE']
    

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!name) return setNameError('Name is required')

        if(!email) return setEmailError('Email is required')

        if(!password) return setPasswordError('Password is required')

        if(!phone) return setPhoneError('Phone is required')

        if(!gender) return setGenderError('Gender is required')  

        const expertData = {
            firstName: name,
            email,
            password,
            countryCode,
            phone: Number.parseInt(phone),
            gender
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/experts`, expertData)
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
                <h2>{ isUpdate ? 'Update Expert' : 'Add Expert'}</h2>
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
                        <label>Email</label>
                        <input 
                        type="email" 
                        className="form-input" 
                        placeholder=""
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onClick={e => setEmailError()}
                        />
                        <span className="red">{emailError}</span>
                    </div>
                    {
                        isUpdate ?
                        null
                        :
                        <div className="form-input-container">
                            <label>Password</label>
                            <input 
                            type="password" 
                            className="form-input" 
                            placeholder=""
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onClick={e => setPasswordError()}
                            />
                            <span className="red">{passwordError}</span>
                        </div>
                    }
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

export default ExpertFormModal