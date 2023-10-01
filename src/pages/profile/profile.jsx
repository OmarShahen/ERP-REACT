import { useState, useEffect } from 'react'
import '../patient-medical.css'
import { serverRequest } from '../../components/API/request'
import ProfileForm from '../../components/forms/profile/profile'
import { useSelector } from 'react-redux'
import CircularLoading from '../../components/loadings/circular'
import { isRolesValid } from '../../utils/roles'
import { useNavigate } from 'react-router-dom'


const ProfilePage = ({ roles }) => {

    const navigate = useNavigate()

    const appUser = useSelector(state => state.user.user)

    const [account, setAccount] = useState()
    const [reload, setReload] = useState(0)

    useEffect(() => {
        scroll(0,0)
        //isRolesValid(appUser.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {

        serverRequest.get(`/v1/users/${appUser._id}`)
        .then(response => {
            const data = response.data
            setAccount(data.user)
        })
        .catch(error => {
            console.error(error)
        })
    }, [reload])


    return <div>
        { account ? <ProfileForm profile={account} reload={reload} setReload={setReload} /> : <CircularLoading /> }
    </div>
}

export default ProfilePage