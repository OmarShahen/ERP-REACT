import { useState, useEffect } from 'react'
import './prescriptions.css'
import { serverRequest } from "../components/API/request"
import { useSelector } from 'react-redux'
import PageHeader from '../components/sections/page-header'
import CircularLoading from '../components/loadings/circular';
import FiltersSection from '../components/sections/filters/filters'
import EmptySection from '../components/sections/empty/empty'
import AppointmentDeleteConfirmationModal from '../components/modals/confirmation/appointment-delete-confirmation-modal'
import AppointmentStatusConfirmationModal from '../components/modals/confirmation/appointment-status-confirmation-modal'
import { isRolesValid } from '../utils/roles'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ReviewCard from '../components/cards/review'
import RateChart from '../components/charts/rate-chart/rate-chart'
import { getExperienceNameByNumber } from '../utils/experience-translator'
import ReviewDeleteConfirmationModal from '../components/modals/confirmation/review-delete-confirmation-modal'


const ReviewsPage = ({ roles }) => {

    const navigate = useNavigate()

    const [targetReview, setTargetReview] = useState({})
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isShowUpdateModal, setIsShowUpdateModal] = useState(false)
    const [status, setStatus] = useState()


    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [showModalForm, setShowModalForm] = useState(false)
    const [reviews, setReviews] = useState([])
    const [totalReviews, setTotalReviews] = useState(0)

    const [statsQuery, setStatsQuery] = useState({})

    useEffect(() => { 
        scroll(0,0) 
        //isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {
        setIsLoading(true)
        const endpointURL = `/v1/reviews`

        serverRequest.get(endpointURL, { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            setReviews(response.data.reviews)
            setTotalReviews(response.data.totalReviews)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload, statsQuery])


    return <div className="page-container">
         { 
        isShowDeleteModal ? 
        <ReviewDeleteConfirmationModal 
        review={targetReview}
        reload={reload}
        setReload={setReload} 
        setIsShowModal={setIsShowDeleteModal}
        /> 
        : 
        null 
        }
        
        <div className="padded-container">
            <PageHeader 
            pageName={'Reviews'} 
            setReload={setReload}
            reload={reload}
            totalNumber={totalReviews}
            /> 
            
            <FiltersSection 
            statsQuery={statsQuery} 
            setStatsQuery={setStatsQuery} 
            isShowUpcomingDates={true}
            defaultValue={'LIFETIME'}
            />
            <br />
            
            {
                isLoading ?
                <CircularLoading />
                :
                reviews.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                        {reviews.map(review => <ReviewCard 
                        review={review} 
                        reload={reload} 
                        setReload={setReload} 
                        setIsShowDeleteModal={setIsShowDeleteModal}
                        setTargetReview={setTargetReview}

                        />)}                    
                </div>
                :
                <EmptySection setIsShowForm={setShowModalForm} />
            }
        </div>
    </div>
}

export default ReviewsPage