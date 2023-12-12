import { useState, useEffect } from 'react'
import '../prescriptions.css'
import { serverRequest } from "../../components/API/request"
import { useSelector } from 'react-redux'
import CircularLoading from '../../components/loadings/circular'
import FloatingButton from '../../components/buttons/floating-button'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { searchValues } from '../../utils/searches/search-values'
import TreatmentSurveyDeleteConfirmationModal from '../../components/modals/confirmation/treatment-survey-delete-confirmation-modal'
import { toast } from 'react-hot-toast'
import PageHeader from '../../components/sections/page-header'
import ValueCard from '../../components/cards/value'
import ValueDeleteConfirmationModal from '../../components/modals/confirmation/value-delete-confirmation-modal'
import ValueFormModal from '../../components/modals/value-form'

const ValuesPage = ({ roles }) => {

    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isShowAddModal, setIsShowAddModal] = useState(false)
    const [targetValue, setTargetValue] = useState({})
    const [isUpdate, setIsUpdate] = useState(false)

    const [reload, setReload] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [values, setValues] = useState([])
    const [searchedValues, setSearchedValues] = useState([])

    useEffect(() => { 
        scroll(0, 0)
    }, [])

    useEffect(() => {
        setIsLoading(true)    
        serverRequest.get(`/v1/values`)
        .then(response => {
            setIsLoading(false)
            setValues(response.data.values)
            setSearchedValues(response.data.values)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload])


    return <div className="page-container page-white-background">
        { 
            isShowDeleteModal ? 
            <ValueDeleteConfirmationModal 
            value={targetValue}
            reload={reload}
            setReload={setReload} 
            setIsShowModal={setIsShowDeleteModal}
            /> 
            : 
            null 
        }
        {
            isShowAddModal ?
            <ValueFormModal 
            setReload={setReload}
            reload={reload}
            setIsUpdate={setIsUpdate}
            isUpdate={isUpdate}
            value={targetValue}
            setValue={setTargetValue}
            setShowFormModal={setIsShowAddModal}
            />
            :
            null
        }

            <div className="padded-container">
                <PageHeader 
                pageName={'Values'}
                reload={reload}
                setReload={setReload}
                addBtnText={'Add Value'}
                setShowModalForm={setIsShowAddModal}
                totalNumber={values.length}
                />
                <div>
                    <div className="search-input-container">
                        <SearchInput 
                        rows={values} 
                        setRows={setSearchedValues}
                        searchRows={searchValues}
                        isHideClinics={true}
                        isShowValues={true}
                        />
                    </div>
                    
                {
                    isLoading ?
                    <CircularLoading />
                    :
                    searchedValues.length !== 0 ?
                    <div className="cards-grey-container cards-3-list-wrapper">
                            {searchedValues.map((value, index) => <ValueCard 
                                value={value} 
                                setReload={setReload} 
                                reload={reload}
                                setIsShowDeleteModal={setIsShowDeleteModal}
                                setShowFormModal={setIsShowAddModal}
                                setTargetValue={setTargetValue}
                                setIsUpdate={setIsUpdate}
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

export default ValuesPage