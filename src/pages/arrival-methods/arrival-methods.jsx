import { useState, useEffect } from 'react'
import '../prescriptions.css'
import { serverRequest } from "../../components/API/request"
import CircularLoading from '../../components/loadings/circular'
import FloatingButton from '../../components/buttons/floating-button'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { searchArrivalMethods } from '../../utils/searches/search-arrival-methods'
import { toast } from 'react-hot-toast'
import { isRolesValid } from '../../utils/roles'
import PageHeader from '../../components/sections/page-header'
import ArrivalMethodCard from '../../components/cards/arrival-method'
import ArrivalMethodFormModal from '../../components/modals/arrival-method-form'
import ArrivalMethodDeleteConfirmationModal from '../../components/modals/confirmation/arrival-method-delete-confirmation-modal'


const ArrivalMethodsPage = ({ roles }) => {

    const [isShowDeleteArrivalMethod, setIsShowDeleteArrivalMethod] = useState(false)
    const [isShowAddArrivalMethodForm, setIsShowAddArrivalMethodForm] = useState(false)
    const [targetArrivalMethod, setTargetArrivalMethod] = useState({})

    const [isUpdateArrivalMethod, setIsUpdateArrivalMethod] = useState(false)

    const [reload, setReload] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [arrivalMethods, setArrivalMethods] = useState([])
    const [searchedArrivalMethods, setSearchedArrivalMethods] = useState([])


    useEffect(() => { 
        scroll(0,0)
    }, [])

    useEffect(() => {
        setIsLoading(true)    
        const endpointURL = `/v1/arrival-methods`  
        serverRequest.get(endpointURL)
        .then(response => {
            setIsLoading(false)
            setArrivalMethods(response.data.arrivalMethods)
            setSearchedArrivalMethods(response.data.arrivalMethods)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload])


    return <div className="page-container page-white-background">
        {
            isShowAddArrivalMethodForm ?
            <ArrivalMethodFormModal 
            reload={reload} 
            setReload={setReload} 
            setShowModalForm={setIsShowAddArrivalMethodForm}  
            isUpdate={isUpdateArrivalMethod}
            setIsUpdate={setIsUpdateArrivalMethod}
            arrivalMethod={targetArrivalMethod}
            />
            :
            null
        }
        {
            isShowDeleteArrivalMethod ?
            <ArrivalMethodDeleteConfirmationModal
            reload={reload}
            setReload={setReload}
            arrivalMethod={targetArrivalMethod}
            setIsShowModal={setIsShowDeleteArrivalMethod}
            />
            :
            null
        }
        
        <div className="show-mobile">
            <FloatingButton setIsShowForm={setIsShowAddArrivalMethodForm} />
        </div>

            <div className="padded-container">
                <PageHeader 
                pageName={'Arrival Methods'}
                reload={reload}
                setReload={setReload}
                addBtnText={'Add Arrival Method'}
                setShowModalForm={setIsShowAddArrivalMethodForm}
                totalNumber={arrivalMethods.length}
                />
                <div>
                    <div className="search-input-container">
                        <SearchInput 
                        rows={arrivalMethods} 
                        setRows={setSearchedArrivalMethods}
                        searchRows={searchArrivalMethods}
                        isHideClinics={true}
                        />
                    </div>
                    
                {
                    isLoading ?
                    <CircularLoading />
                    :
                    searchedArrivalMethods.length !== 0 ?
                    <div className="cards-grey-container cards-3-list-wrapper">
                            {searchedArrivalMethods.map((arrivalMethod, index) => <ArrivalMethodCard 
                                arrivalMethod={arrivalMethod} 
                                setIsShowAddArrivalMethodForm={setIsShowAddArrivalMethodForm}
                                setIsUpdateArrivalMethod={setIsUpdateArrivalMethod}
                                setIsShowDeleteArrivalMethod={setIsShowDeleteArrivalMethod}
                                setTargetArrivalMethod={setTargetArrivalMethod}
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

export default ArrivalMethodsPage