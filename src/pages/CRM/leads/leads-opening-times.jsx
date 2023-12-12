import { useState, useEffect } from 'react'
import '../../prescriptions.css'
import { serverRequest } from "../../../components/API/request"
import CircularLoading from '../../../components/loadings/circular'
import EmptySection from '../../../components/sections/empty/empty'
import { toast } from 'react-hot-toast'
import OpeningTimeCard from '../../../components/cards/crm/opening-times'
import OpeningTimeDeleteConfirmationModal from '../../../components/modals/confirmation/opening-time-delete-confirmation-modal'
import OpeningTimeFormModal from '../../../components/modals/opening-time-form'
import SelectInputField from '../../../components/inputs/select'
import { WEEK_DAYS } from '../../../utils/time'

const LeadOpeningTimesPage = ({ roles }) => {

    const pagePath = window.location.pathname
    const leadId = pagePath.split('/')[3]

    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isShowAddForm, setIsShowAddForm] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const [targetOpeningTime, setTargetOpeningTime] = useState({})

    const [reload, setReload] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [openingTimes, setOpeningTimes] = useState([])
    const [searchedOpeningTimes, setSearchedOpeningTimes] = useState([])


    useEffect(() => {
        setIsLoading(true)  
        serverRequest.get(`/v1/opening-times/leads/${leadId}`)
        .then(response => {
            setIsLoading(false)
            setOpeningTimes(response.data.openingTimes)
            setSearchedOpeningTimes(response.data.openingTimes)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload])

    const searchOpeningTimes = (value) => {
        if(value === 'ALL') {
            setSearchedOpeningTimes(openingTimes)
            return
        }

        setSearchedOpeningTimes(openingTimes.filter(openingTime => openingTime.weekday === value))
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

        <div className="cards-list-wrapper margin-top-1">
            <SelectInputField 
            selectLabel='Select Day'
            options={['ALL', ...WEEK_DAYS]}
            actionFunction={searchOpeningTimes}
            />
        </div>
        <div className="padded-container">      
            {
                isLoading ?
                <CircularLoading />
                :
                searchedOpeningTimes.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                        {searchedOpeningTimes.map((openingTime) => <OpeningTimeCard 
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
}

export default LeadOpeningTimesPage