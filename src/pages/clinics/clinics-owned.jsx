import { useState, useEffect } from 'react'
import '../prescriptions.css'
import { serverRequest } from "../../components/API/request"
import { useSelector } from 'react-redux'
import CircularLoading from '../../components/loadings/circular'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { useNavigate } from 'react-router-dom'
import ClinicCard from '../../components/cards/clinic'
import { searchClinics } from '../../utils/searches/search-clinics'
import ClinicFormModal from '../../components/modals/clinic-form'
import PageHeader from '../../components/sections/page-header'
import ServiceFormModal from '../../components/modals/service-form'
import ClinicDeleteConfirmationModal from '../../components/modals/confirmation/clinic-delete-confirmation-modal'
import { isRolesValid } from '../../utils/roles'
import ClinicRequestFormModal from '../../components/modals/clinic-request-form'
import { useSearchParams } from 'react-router-dom'
import Card from '../../components/cards/card'
import { formatNumber } from '../../utils/numbers'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import FloatingButton from '../../components/buttons/floating-button'
import translations from '../../i18n'

const ClinicsPage = ({ roles }) => {

    const navigate = useNavigate()
    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [searchParams, setSearchParams] = useSearchParams()
    const userIsNew = searchParams.get('isNew')

    const [reload, setReload] = useState(1)
    const [clinicId, setClinicId] = useState()
    const [isShowInfoModal, setIsShowInfoModal] = useState(userIsNew ? true : false)
    const [isShowAddressModal, setIsShowAddressModal] = useState(false)
    const [isShowServiceModal, setIsShowServiceModal] = useState(false)
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isShowRequestModel, setIsShowRequestModel] = useState(false)

    const [targetClinic, setTargetClinic] = useState()
    const [formStatus, setFormStatus] = useState('INFO')
    const [isLoading, setIsLoading] = useState(true)
    const [clinics, setClinics] = useState([])
    const [searchedClinics, setSearchedClinics] = useState([])

    useEffect(() => {
        scroll(0,0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/clinics-owners/owners/${user._id}`)
        .then(response => {
            setIsLoading(false)
            setClinics(response.data.clinics)
            setSearchedClinics(response.data.clinics)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload])


    return <div className="page-container">
        
        <PageHeader 
        pageName={translations[lang]['My Clinics']} 
        isHideBackButton={true} 
        addBtnText={user.roles.includes('DOCTOR') ? translations[lang]['Add Clinic'] : null}
        setShowModalForm={setIsShowInfoModal}
        />
        <div className="cards-list-wrapper margin-bottom-1">
            <Card 
            icon={<NumbersOutlinedIcon />}
            cardHeader={translations[lang]['Clinics']}
            number={formatNumber(clinics.length)}
            iconColor={'#5C60F5'}
            />
        </div>
        { 
            isShowDeleteModal ? 
            <ClinicDeleteConfirmationModal 
            ownership={targetClinic}
            reload={reload}
            setReload={setReload} 
            setIsShowModal={setIsShowDeleteModal}
            /> 
            : 
            null 
        }
        {
            isShowInfoModal ?
            <ClinicFormModal 
            setFormStatus={setFormStatus} 
            setShowFormModal={setIsShowInfoModal} 
            setIsShowServiceModal={setIsShowServiceModal}
            setClinicId={setClinicId}
            reload={reload}
            setReload={setReload}
            />
            :
            null
        }
        {
            isShowServiceModal ?
            <ServiceFormModal 
            setShowFormModal={setIsShowServiceModal} 
            setIsShowRequestModel={setIsShowRequestModel}
            clinicId={clinicId}
            setReload={setReload}
            reload={reload}
            />
            :
            null
        }
        {
            isShowRequestModel ?
            <ClinicRequestFormModal 
            role={'DOCTOR'}
            clinicId={clinicId}
            setShowModalForm={setIsShowRequestModel}
            />
            :
            null
        }
        <div className="show-mobile">
        </div>
            <div className="padded-container">
                    <div className="search-input-container">
                        <SearchInput 
                        rows={clinics} 
                        setRows={setSearchedClinics}
                        searchRows={searchClinics}
                        isHideClinics={true}
                        />
                    </div>
                {
                    isLoading ?
                    <CircularLoading />
                    :
                    searchedClinics.length !== 0 ?
                    <div className="cards-grey-container cards-3-list-wrapper">
                        {searchedClinics.map(clinic => <ClinicCard 
                        clinic={clinic} 
                        setReload={setReload} 
                        reload={reload} 
                        isOwner={false}
                        isShowRenew={true}
                        setIsShowDeleteModal={setIsShowDeleteModal}
                        setTargetClinic={setTargetClinic}
                        />)}
                    </div>
                    :
                    <EmptySection />
                }
            </div>
        </div>
}

export default ClinicsPage