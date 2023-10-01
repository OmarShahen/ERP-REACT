
import { useEffect } from 'react'
import '../patient-medical.css'
import ChangePasswordForm from '../../components/forms/profile/change-password'
import { useSelector } from 'react-redux'
import { isRolesValid } from '../../utils/roles'
import { useNavigate } from 'react-router-dom'

const PasswordPage = ({ roles }) => {

    const navigate = useNavigate()

    useEffect(() => {
        scroll(0, 0)
        //isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    const user = useSelector(state => state.user.user)

    return <div>
        { user ? <ChangePasswordForm /> : null }
    </div>
}

export default PasswordPage