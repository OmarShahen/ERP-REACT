import { useState, useEffect } from 'react'
import '../prescriptions.css'
import { serverRequest } from "../../components/API/request"
import CircularLoading from '../../components/loadings/circular'
import FloatingButton from '../../components/buttons/floating-button'
import EmptySection from '../../components/sections/empty/empty'
import { toast } from 'react-hot-toast'
import PageHeader from '../../components/sections/page-header'
import OpeningTimeCard from '../../components/cards/crm/opening-times'
import OpeningTimeDeleteConfirmationModal from '../../components/modals/confirmation/opening-time-delete-confirmation-modal'
import OpeningTimeFormModal from '../../components/modals/opening-time-form'
import SelectInputField from '../../components/inputs/select'
import { WEEK_DAYS } from '../../utils/time'
import { counties } from '../../utils/counties'


const OpeningTimesPage = ({ roles }) => {

    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isShowAddForm, setIsShowAddForm] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const [targetOpeningTime, setTargetOpeningTime] = useState({})

    const [reload, setReload] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [openingTimes, setOpeningTimes] = useState([])
    const [totalOpeningTimes, setTotalOpeningTimes] = useState(0)


    const [statsQuery, setStatsQuery] = useState({})
    const [weekday, setWeekday] = useState()
    const [county, setCounty] = useState()

    useEffect(() => {
        setIsLoading(true)    
        serverRequest.get(`/v1/opening-times` ,  { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            const data = response.data
            setOpeningTimes(data.openingTimes)
            setTotalOpeningTimes(data.totalOpeningTimes)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload, statsQuery])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get('/v1/opening-times/search', { params: { weekday, county } })
        .then(response => {
            setIsLoading(false)
            const data = response.data
            setOpeningTimes(data.openingTimes)
            setTotalOpeningTimes(data.totalOpeningTimes)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })

    }, [weekday, county])

    const setCountyFunction = (value) => {
        if(value === 'ALL') {
            return setCounty()
        }

        setCounty(value)
        return
    }

    const setWeekdayFunction = (value) => {
        if(value === 'ALL') {
            return setWeekday()
        }

        setWeekday(value)
        return
    }

    return <div className="page-container page-white-background">
        {
            isShowAddForm ?
            <OpeningTimeFormModal 
            reload={reload} 
            setReload={setReload} 
            setShowFormModal={setIsShowAddForm}  
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
            openingTimeObj={targetOpeningTime}
            setOpeningTimeObj={setTargetOpeningTime}
            />
            :
            null
        }
        {
            isShowDeleteModal ?
            <OpeningTimeDeleteConfirmationModal
            reload={reload}
            setReload={setReload}
            openingTime={targetOpeningTime}
            setIsShowModal={setIsShowDeleteModal}
            />
            :
            null
        }
        
        <div className="show-mobile">
            <FloatingButton setIsShowForm={setIsShowAddForm} />
        </div>

            <div className="padded-container">
                <div>
                    <PageHeader 
                    pageName={'Opening Times'}
                    reload={reload}
                    setReload={setReload}
                    addBtnText={'Add Opening Time'}
                    setShowModalForm={setIsShowAddForm}
                    totalNumber={totalOpeningTimes}
                    />
                <div>
            </div>
            <div className="cards-list-wrapper margin-top-1">
                <SelectInputField 
                selectLabel='Select County'
                options={['ALL', ...counties]}
                actionFunction={setCountyFunction}
                />
                <SelectInputField 
                selectLabel='Select Day'
                options={['ALL', ...WEEK_DAYS]}
                actionFunction={setWeekdayFunction}
                />
            </div>
                    
                {
                    isLoading ?
                    <CircularLoading />
                    :
                    openingTimes.length !== 0 ?
                    <div className="cards-grey-container cards-3-list-wrapper">
                            {openingTimes.map((openingTime) => <OpeningTimeCard 
                                openingTime={openingTime} 
                                setReload={setReload} 
                                reload={reload}
                                setIsUpdate={setIsUpdate}
                                setIsShowUpdate={setIsShowAddForm}
                                setIsShowDelete={setIsShowDeleteModal}
                                setOpeningTime={setTargetOpeningTime}
                                />
                            )}
                    </div>
                    :
                    <EmptySection />
    }
            </div>
        </div>
    </div>
}

export default OpeningTimesPage