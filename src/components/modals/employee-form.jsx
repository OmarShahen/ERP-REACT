import { useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import CardTransition from '../transitions/card-transitions'

const EmployeeFormModal = ({ reload, setReload, setShowModalForm, isUpdate, setIsUpdate, employee }) => {

    const [isSubmit, setIsSubmit] = useState(false)

    const [name, setName] = useState(isUpdate ? employee.firstName : null)
    const [email, setEmail] = useState(isUpdate ? employee.email : null)
    const [password, setPassword] = useState()    

    const [nameError, setNameError] = useState()
    const [emailError, setEmailError] = useState()
    const [passwordError, setPasswordError] = useState()
    

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!name) return setNameError('الاسم مطلوب')

        if(!email) return setEmailError('البريد مطلوب')

        if(!password) return setPasswordError('كلمة المرور مطلوبة')

        const employeeData = {
            firstName: name,
            email,
            password,
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/employees`, employeeData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            reload ? setReload(reload + 1) : null
            setShowModalForm(false)
            toast.success(data.message, { position: 'top-left', duration: 3000 })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            
            try {

                const errorData = error?.response?.data

                if(errorData.field === 'name') return setNameError(errorData.message)

                if(errorData.field === 'email') return setEmailError(errorData.message)

                if(errorData.field === 'password') return setPasswordError(errorData.message)

                toast.error(error.response.data.message, { position: 'top-left', duration: 3000 })

            } catch(error) {}
        })

    }

    const handleUpdate = (e) => {
        e.preventDefault()

        if(!name) return setNameError('الاسم مطلوب')

        if(!email) return setEmailError('البريد مطلوب')

        const employeeData = {
            firstName: name,
            email,
        }

        setIsSubmit(true)
        serverRequest.put(`/v1/employees/${employee._id}`, employeeData)
        .then(response => {
            setIsSubmit(false)
            setIsUpdate(false)
            const data = response.data
            reload ? setReload(reload + 1) : null
            setShowModalForm(false)
            toast.success(data.message, { position: 'top-left', duration: 3000 })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            
            try {

                const errorData = error?.response?.data

                if(errorData.field === 'name') return setNameError(errorData.message)

                if(errorData.field === 'email') return setEmailError(errorData.message)

                if(errorData.field === 'password') return setPasswordError(errorData.message)

                toast.error(error.response.data.message, { position: 'top-left', duration: 3000 })

            } catch(error) {}
        })

    }


    return <div className="modal">
        <CardTransition>
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>{ isUpdate ? 'تحديث الموظف' : 'اضافة الموظف'}</h2>
            </div>
            <div className="modal-body-container">
                <form 
                id="lead-form" 
                className="modal-form-container responsive-form body-text right-direction" 
                onSubmit={isUpdate ? handleUpdate : handleSubmit}
                >
                    <div className="form-input-container">
                        <label>الاسم</label>
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
                        <label>البريد</label>
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
                            <label>كلمة المرور</label>
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
                        >{isUpdate ? 'تحديث' : 'اضافة'}</button>
                    }
                </div>
                <div>
                    <button 
                    className="normal-button cancel-button"
                    onClick={e => {
                        setShowModalForm(false)
                        setIsUpdate ? setIsUpdate(false) : null
                    }}
                    >الغاء</button>
                </div>
            </div>
        </div>
        </CardTransition>
    </div>
}

export default EmployeeFormModal