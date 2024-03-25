import { useState, useEffect } from 'react'
import './prescriptions.css'
import PageHeader from '../components/sections/page-header'
import { serverRequest } from '../components/API/request'
import CircularLoading from '../components/loadings/circular'
import { useSelector } from 'react-redux'
import EmptySection from '../components/sections/empty/empty'
import { useNavigate } from 'react-router-dom'
import { isRolesValid } from '../utils/roles'
import DeleteConfirmationModal from '../components/modals/confirmation/delete-confirmation-modal'
import { toast } from 'react-hot-toast'
import SelectInputField from '../components/inputs/select'
import QuestionCard from '../components/cards/question'
import QuestionFormModal from '../components/modals/question-form'
import SettingsForm from '../components/forms/settings/settings'


const SettingsPage = ({ roles }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)
    
    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)

    const [settings, setSettings] = useState()

    useEffect(() => {
        isRolesValid(user.roles, roles) ? null : navigate('/login')
        scroll(0, 0)
    }, [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get('/v1/settings')
        .then(response => {
            setIsLoading(false)
            setSettings(response.data.settings)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload])


    return <div className="page-container">
        
        <div className="padded-container">
            <PageHeader 
            pageName={'App Settings'} 
            /> 
            {
                isLoading ?
                <CircularLoading />
                :
                <SettingsForm 
                settings={settings}
                reload={reload}
                setReload={setReload}
                />
            }
        </div>
        
    </div>
}

export default SettingsPage