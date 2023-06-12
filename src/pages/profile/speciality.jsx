import { useState, useEffect } from 'react'
import { serverRequest } from '../../components/API/request'
import '../patient-medical.css'
import { useSelector } from 'react-redux'
import SpecialityForm from '../../components/forms/profile/speciality'
import { useNavigate } from 'react-router-dom'

const SpecialityPage = ({ roles }) => {

    const navigate = useNavigate()
    const user = useSelector(state => state.user.user)

    const [reload, setReload] = useState(1)
    const [profile, setProfile] = useState()

    useEffect(() => {
        scroll(0,0)

        if(!roles.includes(user.role)) {
            navigate('/login')
        }
    }, [])

    useEffect(() => {

        serverRequest.get(`/v1/users/${user._id}/speciality`)
        .then(response => {
            const data = response.data
            setProfile(data.user)
        })
        .catch(error => {
            console.error(error)
        })
    }, [reload])

    return <div>
        { profile ? <SpecialityForm profile={profile} reload={reload} setReload={setReload} /> : null }
    </div>
}

export default SpecialityPage