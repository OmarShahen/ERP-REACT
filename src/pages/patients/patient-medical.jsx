import { useState, useEffect } from 'react'
import '../patient-medical.css'
import { serverRequest } from '../../components/API/request'
import PatientProfileSection from '../../components/sections/patient-profile'
import CircularLoading from '../../components/loadings/circular'
import './patient-profile.css'
import { isRolesValid } from '../../utils/roles'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import translations from '../../i18n'

const PatientMedicalPage = ({ roles }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]

    const [isLoading, setIsLoading] = useState(true)
    const [patient, setPatient] = useState({})

    useEffect(() => { 
        scroll(0, 0) 
        //isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])
    
    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/patients/${patientId}`)
        .then(response => {
            setIsLoading(false)
            const data = response.data
            setPatient(data.patient)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [])


    return <div>
        <div>
            <div>
                {
                    isLoading ?
                    <CircularLoading />
                    :
                    <div> 
                        <PatientProfileSection patient={patient} />
                    </div>
                }
            </div>
        </div>
    </div>
}

export default PatientMedicalPage