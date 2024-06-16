import { useState, useEffect } from 'react'
import './prescriptions.css'
import { serverRequest } from "../components/API/request"
import PageHeader from '../components/sections/page-header'
import Card from '../components/cards/card';
import CircularLoading from '../components/loadings/circular';
import FiltersSection from '../components/sections/filters/filters'
import EmptySection from '../components/sections/empty/empty'
import { formatNumber } from '../utils/numbers'
import { isRolesValid } from '../utils/roles'
import PaymentCard from '../components/cards/payment'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import UpdateConfirmationModal from '../components/modals/confirmation/update-confirmation-modal';
import { toast } from 'react-hot-toast'
import ExpertVerificationCard from '../components/cards/expert-verification';
import DeleteConfirmationModal from '../components/modals/confirmation/delete-confirmation-modal';
import ExpertVerificationFormModal from '../components/modals/expert-verification-form';
import { setIsShowModal } from '../redux/slices/modalSlice';
import SearchInput from '../components/inputs/search';
import BrandCard from '../components/cards/brands';
import BrandFormModal from '../components/modals/brand-form';
import FloatingButton from '../components/buttons/floating-button';


const BrandsPage = ({ roles }) => {

    const [target, setTarget] = useState()
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isShowUpdateModal, setIsShowUpdateModal] = useState(false)

    const [isLoading, setIsLoading] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [reload, setReload] = useState(1)
    const [isShowModalForm, setIsShowModalForm] = useState(false)
    const [brands, setBrands] = useState([])
    const [categories, setCategories] = useState([])


    useEffect(() => { 
        scroll(0,0) 
        //isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/brands`)
        .then(response => {
            setIsLoading(false)
            setBrands(response.data.brands)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload])

    useEffect(() => {
        serverRequest.get(`/v1/specialities`)
        .then(response => {
            setCategories(response.data.specialities)
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }, [])


    const deleteBrand = (brandId) => {
        setIsDeleting(true)
        serverRequest.delete(`/v1/brands/${brandId}`)
        .then(response => {
            setIsDeleting(false)
            setReload(reload + 1)
            setIsShowDeleteModal(false)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            setIsDeleting(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }

    const searchBrands = (e) => {
        const value = e.target.value
        if(value === 'ALL') {
            setReload(reload + 1)
            return
        }
        setIsLoading(true)
        serverRequest.get(`/v1/brands/categories/${value}`)
        .then(response => {
            setIsLoading(false)
            setBrands(response.data.brands)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }

    return <div className="page-container">
        {
            isShowModalForm ?
            <BrandFormModal 
            brand={target}
            setBrand={setTarget}
            setShowModalForm={setIsShowModalForm}
            setReload={setReload}
            reload={reload}
            />
            :
            null
        }
        { 
            isShowDeleteModal ? 
            <DeleteConfirmationModal 
            setIsShowModal={setIsShowDeleteModal}
            isLoading={isDeleting}
            deleteAction={deleteBrand}
            id={target._id}
            /> 
            : 
            null 
        }

        <div className="show-mobile">
            <FloatingButton setIsShowForm={setIsShowModalForm} />
        </div>

        <div className="padded-container">
            <PageHeader 
            pageName={'Brands'} 
            setReload={setReload}
            reload={reload}
            addBtnText={'Add Brand'}
            setShowModalForm={setIsShowModalForm}
            /> 
            <div className="cards-3-list-wrapper margin-bottom-1">
                <select
                className="form-select"
                onChange={searchBrands}
                >
                    <option disabled selected>Select Category</option>
                    <option value="ALL">All</option>
                    {categories.map(category => <option value={category._id}>{category.name}</option>)}
                </select>
            </div>
            {
                isLoading ?
                <CircularLoading />
                :
                brands.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                        {brands.map(brand => <BrandCard 
                        brand={brand} 
                        setIsShowDeleteModal={setIsShowDeleteModal}
                        setTarget={setTarget}
                        setIsShowUpdateModal={setIsShowModalForm}
                        />)}                    
                </div>
                :
                <EmptySection setIsShowForm={setIsShowModalForm} />
            }
        </div>
    </div>
}

export default BrandsPage