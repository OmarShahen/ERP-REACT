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
                    <div className="patient-profile-grid-container"> 
                        <div className="patient-profile-page-navigator-container">
                            <ul>
                                <li>
                                    <a href="#demographic-section">
                                        {translations[lang]['Demographic']}
                                    </a>
                                </li>
                                <li>
                                    <a href="#bad-habits-section">
                                        {translations[lang]['Bad Habits']}
                                    </a>
                                </li>
                                <li>
                                    <a href="#chronic-section">
                                        {translations[lang]['Chronic Diseases']}
                                    </a>
                                </li>
                                <li>
                                    <a href="#genetic-section">
                                        {translations[lang]['Genetic Issue']}
                                    </a>
                                </li>
                                <li>
                                    <a href="#blood-section">
                                        {translations[lang]['Blood']}
                                    </a>
                                </li>
                                <li>
                                    <a href="#allergies-section">
                                        {translations[lang]['Allergies']}
                                    </a>
                                </li>
                                <li>
                                    <a href="#immune-section">
                                        {translations[lang]['Immune Diseases']}
                                    </a>
                                </li>
                                <li>
                                    <a href="#surgery-section">
                                        {translations[lang]['Past Surgeries']}
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <PatientProfileSection patient={patient} />
                    </div>
                }
            </div>
        </div>
    </div>
}

export default PatientMedicalPage