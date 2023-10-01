import { useState, useEffect } from 'react'
import './prescriptions.css'
import { useNavigate } from "react-router-dom"
import { serverRequest } from "../components/API/request"
import { useSelector } from 'react-redux'
import NavigationBar from '../components/navigation/navigation-bar'
import { toast } from 'react-hot-toast'
import PrescriptionCard from '../components/cards/prescription'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { isRolesValid } from '../utils/roles'
import PrescriptionConfirmationDeleteModal from '../components/modals/confirmation/prescription-delete-confirmation-modal'
import translations from '../i18n'
import CircularLoading from '../components/loadings/circular'


const PrescriptionPage = ({ roles }) => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const prescriptionId = pagePath.split('/')[2]

    const [reload, setReload] = useState(1)
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [prescription, setPrescription] = useState()

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    useEffect(() => {
        scroll(0,0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {
        serverRequest.get(`/v1/prescriptions/${prescriptionId}`)
        .then(response => {
            const data = response.data
            setPrescription(data.prescription)
        })
        .catch(error => {
            console.error(error)

            if(error.response.data.field === 'prescriptionId') return navigate('/prescriptions')

            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }, [reload])

 
    return <div className="page-container page-white-background">
        <NavigationBar pageName={translations[lang]['Prescription']} />
        {
            isShowDeleteModal ?
            <PrescriptionConfirmationDeleteModal
            setReload={setReload}
            reload={reload}
            prescription={prescription}
            setIsShowModal={setIsShowDeleteModal}
            />
            :
            null
        }
        <div className="padded-container">
            <div className="page-header-wrapper">
            <div className="back-button-container">
                    <ArrowBackIcon />
                    <span onClick={e => navigate(-1)}>{translations[lang]['Back']}</span>
                </div>
                <div className="page-header-container">
                    <div>
                        <h1>
                            {translations[lang]['Prescription']} #{prescription?.prescriptionId}
                        </h1>
                    </div>
                    <div className="btns-container subheader-text">
                    </div>
                </div>
            </div>
            { 
                prescription ?
                <div className="grey-bg-container">
                        <PrescriptionCard 
                        prescription={prescription} 
                        setIsShowDeleteModal={setIsShowDeleteModal}
                        setTargetPrescription={setPrescription}
                        /> 
                </div>
                : 
                <CircularLoading /> 
           }
        </div>
    </div>
}

export default PrescriptionPage