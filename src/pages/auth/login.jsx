import { useState } from 'react'
import './auth.css'
import { serverRequest } from '../../components/API/request'
import { TailSpin } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../redux/slices/userSlice'
import { NavLink } from 'react-router-dom'
import logo from '../../assets/khatab.png'
import PageTransition from '../../components/transitions/page-transitions'
import translations from '../../i18n'

const LoginPage = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const lang = useSelector(state => state.lang.lang)

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [isSubmit, setIsSubmit] = useState(false)

    const [emailError, setEmailError] = useState()
    const [passwordError, setPasswordError] = useState()


    const handleSubmit = (e) => {
        e.preventDefault()

        if(!email) return setEmailError(translations[lang]['email is required'])

        if(!password) return setPasswordError(translations[lang]['password is required'])

        const loginData = {
            email: email.trim(),
            password: password.trim()
        }

        setIsSubmit(true)
        serverRequest.post('/v1/auth/login', loginData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            let user = data.user
            user.accessToken = data.token
            const isLogged = true
            sessionStorage.setItem('user', JSON.stringify({ ...data.user, isLogged }))
            dispatch(setUser({ ...data.user, isLogged }))
            return navigate(user.type === 'ADMIN' ? '/dashboard' : '/pos')
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            const errorData = error.response.data

            if(errorData.field === 'email') {
                return setEmailError(errorData.message)
            } else if(errorData.field === 'password') {
                return setPasswordError(errorData.message)
            }

        })


    }

    return <PageTransition>
    <div>
        <div className="form-page-center">
                <form className="login-form-container" onSubmit={handleSubmit}>
                    <div className="login-form-header-container subheader-text">
                        <div className="center">
                            <img src={logo} style={{ width: "", height: "4rem"  }} />
                        </div>
                        <span className="center grey-text body-text margin-top-1 bold-text">{translations[lang]['Login to your account']}</span>
                    </div>
                    <div className="login-form-body-container body-text">
                        <div className="form-input-container">
                            <label>{translations[lang]['Email']}</label>
                            <input 
                            type="email" 
                            className="form-input"
                            onChange={e => setEmail(e.target.value)}
                            onClick={e => setEmailError()}
                            />
                            <span className="red">{emailError}</span>
                        </div>
                        <div className="form-input-container">
                            <div className="password-and-forgot-password-container right-direction">
                                <label>{translations[lang]['Password']}</label>
                                <NavLink to="/forgot-password" className="action-color-text bold-text">{translations[lang]['Forgot your password?']}</NavLink>
                            </div>
                            <input 
                            type="password" 
                            className="form-input"
                            onChange={e => setPassword(e.target.value)}
                            onClick={e => setPasswordError()}
                            />
                            <span className="red">{passwordError}</span>
                        </div>
                        <div className="submit-btn-container">
                            {
                                isSubmit ?
                                <div className="flex-center">
                                    <TailSpin width="40" height="40" color="#4c83ee" />
                                </div>
                                :
                                <input type="submit" className="action-color-bg white-text bold-text" value={'تسجيل الدخول'} />
                            }
                        </div>
                    </div>
                </form>
        </div>
    </div>
    </PageTransition>
}

export default LoginPage