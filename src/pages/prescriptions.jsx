import { useState, useEffect } from 'react'
import './prescriptions.css'
import PageHeader from '../components/sections/page-header'
import { serverRequest } from '../components/API/request'
import NavigationBar from '../components/navigation/navigation-bar'
import CircularLoading from '../components/loadings/circular'
import { useSelector } from 'react-redux'
import FiltersSection from '../components/sections/filters/filters'
import PrescriptionCard from '../components/cards/prescription'
import EmptySection from '../components/sections/empty/empty'
import SearchInput from '../components/inputs/search'
import { searchPrescriptions } from '../utils/searches/search-prescriptions'
import { useNavigate } from 'react-router-dom'
import PrescriptionDeleteConfirmationModal from '../components/modals/confirmation/prescription-delete-confirmation-modal'
import { isRolesValid } from '../utils/roles'
import Card from '../components/cards/card'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import { formatNumber } from '../utils/numbers'
import FloatingButton from '../components/buttons/floating-button'
import translations from '../i18n'
import PrescriptionSurveyCard from '../components/cards/prescription-survey'
import PrescriptionUpdateSurveyConfirmationModal from '../components/modals/confirmation/prescription-update-survey-confirmation-modal'


const PrescriptionsPage = ({ roles }) => {

    const navigate = useNavigate()
    
    const [isShowModal, setIsShowModal] = useState(false)
    const [targetPrescription, setTargetPrescription] = useState({})

    const [isShowUpdateSurveyModal, setIsShowUpdateSurveyModal] = useState(false)

    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [prescriptions, setPrescriptions] = useState([])
    const [searchedPrescriptions, setSearchedPrescriptions] = useState([])

    const [viewStatus, setViewStatus] = useState('ALL')

    const activeElementColor = { border: '2px solid #4c83ee', color: '#4c83ee' }

    const todayDate = new Date()
    const weekDate = new Date()

    todayDate.setDate(todayDate.getDate() + 1)
    weekDate.setDate(weekDate.getDate() - 7)

    const [statsQuery, setStatsQuery] = useState({ from: weekDate, to: todayDate })

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    useEffect(() => {
        //isRolesValid(user.roles, roles) ? null : navigate('/login')
        scroll(0,0)
    }, [])

    useEffect(() => {

        let endpointURL = `/v1/prescriptions/followup-service/clinics-subscriptions/active`

        setIsLoading(true)
        serverRequest.get(endpointURL, { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            setPrescriptions(response.data.prescriptions)
            setSearchedPrescriptions(response.data.prescriptions)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload, statsQuery])


    return <div className="page-container">
        { 
            isShowUpdateSurveyModal ? 
            <PrescriptionUpdateSurveyConfirmationModal 
            prescription={targetPrescription}
            isSurveyed={!targetPrescription?.survey?.isDone}
            reload={reload}
            setReload={setReload} 
            setIsShowModal={setIsShowUpdateSurveyModal}
            /> 
            : 
            null 
        }
        <div className="padded-container">
            <PageHeader 
            pageName={translations[lang]['Prescriptions']} 
            reload={reload}
            setReload={setReload}
            />
            <div className="cards-3-list-wrapper margin-bottom-1">
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={translations[lang]['Prescriptions']}
                number={formatNumber(searchedPrescriptions.length)}
                iconColor={'#5C60F5'}
                />
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={'Done Surveys'}
                number={formatNumber(prescriptions.filter(prescription => prescription?.survey?.isDone).length)}
                iconColor={'#5C60F5'}
                />
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={'Waiting Surveys'}
                number={formatNumber(prescriptions.filter(prescription => !prescription?.survey?.isDone).length)}
                iconColor={'#5C60F5'}
                />
            </div>
            <FiltersSection 
            setStatsQuery={setStatsQuery} 
            statsQuery={statsQuery}
            defaultValue={'-7'}
            />

            <div className="search-input-container">
                <SearchInput 
                rows={prescriptions} 
                setRows={setSearchedPrescriptions}
                searchRows={searchPrescriptions}
                isHideClinics={user.roles.includes('STAFF') ? true : false }
                />
            </div>
            <div className="appointments-categories-container cards-list-wrapper">
                <div style={ viewStatus === 'ALL' ? activeElementColor : null } onClick={e => {
                    setViewStatus('ALL')
                    setSearchedPrescriptions(prescriptions.filter(prescription => true))
                }}>
                    {translations[lang]['All']}
                </div>
                <div style={ viewStatus === 'DONE' ?  activeElementColor : null } onClick={e => {
                    setViewStatus('DONE')
                    setSearchedPrescriptions(prescriptions.filter(prescription => prescription?.survey?.isDone))
                }}>
                    {'Done'}
                </div>
                <div style={ viewStatus === 'WAITING' ?  activeElementColor : null } onClick={e => {
                    setViewStatus('WAITING')
                    setSearchedPrescriptions(prescriptions.filter(prescription => !prescription?.survey?.isDone))
                }}>
                    {'Waiting'}
                </div>
            </div>
            {
                isLoading ?
                <CircularLoading />
                :
                searchedPrescriptions.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                    {searchedPrescriptions.map(prescription =><PrescriptionSurveyCard 
                    prescription={prescription} 
                    setReload={setReload} 
                    reload={reload} 
                    setTargetPrescription={setTargetPrescription}
                    setIsShowUpdatePrescription={setIsShowUpdateSurveyModal}
                    />)}
                </div>
                    
                :
                <EmptySection />
            }
        </div>
        
    </div>
}

export default PrescriptionsPage