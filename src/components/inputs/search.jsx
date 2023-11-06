import { useEffect, useState } from 'react'
import { serverRequest } from '../API/request'
import SearchIcon from '@mui/icons-material/Search'
import './input.css'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import translations from '../../i18n'
import { leadStatus, leadStages } from '../../utils/values'
import { capitalizeFirstLetter } from '../../utils/formatString'
import { formatNumber } from '../../utils/numbers'


const SearchInput = ({ 
    rows, 
    setRows, 
    searchRows, 
    isCustomClincis=false, 
    customClinics=[], 
    isHideClinics, 
    isHideSpeciality=true,
    isSpecialityNested=true,
    isShowInsuranceCompanies=false,
    isShowStatus=false,
    isShowStages=false
}) => { 

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [clinics, setClinics] = useState(customClinics)
    const [specialities, setSpecialities] = useState([])
    const [insuranceCompanies, setInsuranceCompanies] = useState([])

    useEffect(() => {
        if(isCustomClincis) {
            setClinics(customClinics)
        }
    }, [customClinics])

    useEffect(() => {

        if(isCustomClincis || isHideClinics) {
            return
        }

        let endpointURL = `/v1/clinics/followup-service/clinics-subscriptions/active`

        serverRequest.get(endpointURL)
        .then(response => {
            const data = response.data
            setClinics(data.clinics)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })

    }, [])

    useEffect(() => {

        if(isHideSpeciality) {
            return
        } 

        serverRequest.get(`/v1/specialities`)
        .then(response => {
            const data = response.data
            setSpecialities(data.specialities)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })

    }, [])

    useEffect(() => {
        
        if(!isShowInsuranceCompanies) {
            return
        }

        const endpointURL = user.roles.includes('STAFF') ? `/v1/insurances/clinics/${user.clinicId}` : `/v1/insurances/owners/${user._id}`

        serverRequest.get(endpointURL)
        .then(response => {
            setInsuranceCompanies(response.data.insurances)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right'})
        })

    }, [])

    return <div className="cards-3-list-wrapper">
        <div className="search-field-input-container">
            <span>
                <SearchIcon />
            </span>
            <input 
            type="text" 
            className="form-input"
            placeholder={translations[lang]["Search..."]}
            onChange={e => setRows(rows.filter(row => searchRows(row, e.target.value)))}
            />
        </div>
        {
            isHideClinics ?
            null
            :
            <div className="form-input-container">
                <select
                className="form-input"
                onChange={e => {
                    if(e.target.value === 'ALL') {
                        setRows(rows)
                        return
                    }

                    setRows(rows.filter(row => row.clinicId === e.target.value))
                }}
                >
                    <option selected disabled>{translations[lang]['Select clinic']}</option>
                    <option value={'ALL'}>{translations[lang]['All']}</option>
                    {clinics.map(clinic => <option value={clinic?._id}>{clinic?.name}</option>)}
                </select>
            </div>
        }
        {
            isHideSpeciality ?
            null
            :
            <div className="form-input-container">
                <select
                className="form-input"
                onChange={e => {
                    if(e.target.value === 'ALL') {
                        setRows(rows)
                        return
                    }

                    isSpecialityNested ?
                    setRows(rows.filter(row => row?.doctor?.speciality.includes(e.target.value)))
                    :
                    setRows(rows.filter(row => row?.speciality?.includes(e.target.value)))
                }}
                >
                    <option selected disabled>{translations[lang]['Select Speciality']}</option>
                    <option value={'ALL'}>{translations[lang]['All']}</option>
                    {specialities.map(special => <option value={special._id}>{special.name}</option>)}
                </select>
            </div> 
        }

        {
            isShowInsuranceCompanies ?
            <div className="form-input-container">
                <select
                className="form-input"
                onChange={e => {
                    if(e.target.value === 'ALL') {
                        setRows(rows)
                        return
                    }

                    if(e.target.value === 'NO-INSURANCE') {
                        setRows(rows.filter(row => !row.insuranceCompanyId))
                        return
                    }

                    if(e.target.value === 'INSURANCED') {
                        setRows(rows.filter(row => row.insuranceCompanyId))
                        return
                    }

                    setRows(rows.filter(row => row.insuranceCompanyId === e.target.value))
                }}
                >
                    <option selected disabled>{translations[lang]['Select Insurance Company']}</option>
                    <option value="ALL">{translations[lang]['All']}</option>
                    <option value="NO-INSURANCE">{translations[lang]['No Insurance']}</option>
                    <option value="INSURANCED">{translations[lang]['Insuranced Only']}</option>
                    {insuranceCompanies.map(company => <option value={company?._id}>{company?.name}</option>)}
                </select>
            </div>
            :
            null
        }
        {
            isShowStatus ?
            <div className="form-input-container">
                <select 
                className="form-input"
                onChange={e => {
                    if(e.target.value === 'ALL') {
                        return setRows(rows)
                    }

                    return setRows(rows.filter(row => row.status === e.target.value))
                }}
                >
                    <option disabled selected>Select status</option>
                    <option value="ALL">All</option>
                    {leadStatus.map(status => <option value={status}>{capitalizeFirstLetter(status)}</option>)}
                </select>
            </div>
            :
            null
        }
        {
            isShowStatus ?
            <div className="form-input-container">
                <select 
                className="form-input"
                onChange={e => {
                    if(e.target.value === 'ALL') {
                        return setRows(rows)
                    }

                    return setRows(rows.filter(row => row.stage === e.target.value))
                }}
                >
                    <option disabled selected>Select stage</option>
                    <option value="ALL">All</option>
                    {leadStages.map(stage => <option value={stage}>{`${capitalizeFirstLetter(stage)} (${formatNumber(rows.filter(row => row.stage === stage).length)})`}</option>)}
                </select>
            </div>
            :
            null
        }
         
        {/*<div className="search-input-result-size-container">
            <DocumentsSizes size={rows.length} />
    </div>*/}
    </div>
}

export default SearchInput