import { useState, useEffect } from 'react'
import './prescriptions.css'
import PageHeader from '../components/sections/page-header'
import { serverRequest } from '../components/API/request'
import CircularLoading from '../components/loadings/circular'
import { useSelector } from 'react-redux'
import FiltersSection from '../components/sections/filters/filters'
import EmptySection from '../components/sections/empty/empty'
import SearchInput from '../components/inputs/search'
import { useNavigate } from 'react-router-dom'
import { isRolesValid } from '../utils/roles'
import ExpertFormModal from '../components/modals/expert-form'
import DeleteConfirmationModal from '../components/modals/confirmation/delete-confirmation-modal'
import UserCard from '../components/cards/user'
import { toast } from 'react-hot-toast'
import SelectInputField from '../components/inputs/select'
import PromoCodeCard from '../components/cards/promo-code'
import PromoCodeFormModal from '../components/modals/promo-code'


const PromoCodesPage = ({ roles }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)
    
    const [isShowModal, setIsShowModal] = useState(false)
    const [target, setTarget] = useState({})

    const [isUpdate, setIsUpdate] = useState(false)
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)

    const [isDeleting, setIsDeleting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [promoCodes, setPromoCodes] = useState([])

    useEffect(() => {
        isRolesValid(user.roles, roles) ? null : navigate('/login')
        scroll(0, 0)
    }, [])


    useEffect(() => {

        setIsLoading(true)
        serverRequest.get(`/v1/promo-codes`)
        .then(response => {
            setIsLoading(false)
            setPromoCodes(response.data.promoCodes)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload])



    const deletePromoCode = (promoCodeId) => {
        setIsDeleting(true)
        serverRequest.delete(`/v1/promo-codes/${promoCodeId}`)
        .then(response => {
            setIsDeleting(false)
            setReload(reload + 1)
            setIsShowDeleteModal(false)
            setTarget()
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            setIsDeleting(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }


    return <div className="page-container">
        {
            isShowDeleteModal ?
            <DeleteConfirmationModal 
            id={target._id}
            isLoading={isDeleting}
            setIsShowModal={setIsShowDeleteModal}
            deleteAction={deletePromoCode}
            />
            :
            null
        }
        {
            isShowModal ?
            <PromoCodeFormModal 
            reload={reload}
            setReload={setReload}
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
            setShowModalForm={setIsShowModal}
            promoCode={target}
            />
            :
            null
        }
        
        <div className="padded-container">
            <PageHeader 
            pageName={'Coupons'} 
            reload={reload}
            setReload={setReload}
            totalNumber={promoCodes.length}
            addBtnText={'Add Coupon'}
            setShowModalForm={setIsShowModal}
            />
            
            {
                isLoading ?
                <CircularLoading />
                :
                promoCodes.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                    {promoCodes.map(promoCode =><PromoCodeCard 
                    promoCode={promoCode} 
                    setReload={setReload} 
                    reload={reload} 
                    setTarget={setTarget}
                    setIsShowDeleteModal={setIsShowDeleteModal}
                    setIsUpdate={setIsUpdate}
                    setIsShowForm={setIsShowModal}
                    />)}
                </div>
                    
                :
                <EmptySection />
            }
        </div>
        
    </div>
}

export default PromoCodesPage