import { useState, useEffect } from 'react'
import '../../prescriptions.css'
import { serverRequest } from "../../../components/API/request"
import CircularLoading from '../../../components/loadings/circular'
import FloatingButton from '../../../components/buttons/floating-button'
import EmptySection from '../../../components/sections/empty/empty'
import SearchInput from '../../../components/inputs/search'
import { searchMessagesTemplates } from '../../../utils/searches/search-messages-templates'
import { toast } from 'react-hot-toast'
import FiltersSection from '../../../components/sections/filters/filters'
import PageHeader from '../../../components/sections/page-header'
import MessageTemplateCard from '../../../components/cards/crm/messages-templates'
import MessageTemplateDeleteConfirmationModal from '../../../components/modals/confirmation/crm/message-template-delete-confirmation-modal'
import MessageTemplateFormModal from '../../../components/modals/message-template-form'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import Card from '../../../components/cards/card'
import { formatNumber } from '../../../utils/numbers'


const MessagesTemplatesPage = ({ roles }) => {

    const [isShowDeleteMessageTemplateModal, setIsShowDeleteMessageTemplateModal] = useState(false)
    const [isShowAddMessageTemplateForm, setIsShowAddMessageTemplateForm] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const [targetMessageTemplate, setTargetMessageTemplate] = useState({})

    const [reload, setReload] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [messagesTemplates, setMessagesTemplates] = useState([])
    const [searchedMessagesTemplates, setSearchedMessagesTemplates] = useState([])

    const [statsQuery, setStatsQuery] = useState({})


    useEffect(() => {
        setIsLoading(true)  
        serverRequest.get(`/v1/crm/messages-templates`,  { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            setMessagesTemplates(response.data.messagesTemplates)
            setSearchedMessagesTemplates(response.data.messagesTemplates)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload, statsQuery])


    return <div className="page-container page-white-background">
        {
            isShowAddMessageTemplateForm ?
            <MessageTemplateFormModal 
            reload={reload} 
            setReload={setReload} 
            setShowFormModal={setIsShowAddMessageTemplateForm}  
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
            message={targetMessageTemplate}
            setMessage={setTargetMessageTemplate}
            />
            :
            null
        }
        {
            isShowDeleteMessageTemplateModal ?
            <MessageTemplateDeleteConfirmationModal
            reload={reload}
            setReload={setReload}
            messageTemplate={targetMessageTemplate}
            setIsShowModal={setIsShowDeleteMessageTemplateModal}
            />
            :
            null
        }

        <div className="show-mobile">
            <FloatingButton setIsShowForm={setIsShowAddMessageTemplateForm} />
        </div>

        <div className="padded-container">
                            
            <PageHeader 
            pageName={'Messages'}
            addBtnText={'Add Message'}
            setReload={setReload}
            reload={reload}
            setShowModalForm={setIsShowAddMessageTemplateForm}
            />
            <FiltersSection 
            setStatsQuery={setStatsQuery} 
            statsQuery={statsQuery}
            defaultValue={'LIFETIME'}
            />
            <div className="search-input-container">
                <SearchInput 
                rows={messagesTemplates} 
                setRows={setSearchedMessagesTemplates}
                searchRows={searchMessagesTemplates}
                isHideClinics={true}
                isShowMessages={true}
                />
            </div>
                    
                {
                    isLoading ?
                    <CircularLoading />
                    :
                    searchedMessagesTemplates.length !== 0 ?
                    <div className="cards-grey-container cards-3-list-wrapper">
                            {searchedMessagesTemplates.map((message, index) => <MessageTemplateCard 
                                message={message} 
                                setReload={setReload} 
                                reload={reload}
                                setIsUpdate={setIsUpdate}
                                setIsShowUpdateModal={setIsShowAddMessageTemplateForm}
                                setIsShowDeleteModal={setIsShowDeleteMessageTemplateModal}
                                setTargetMessageTemplate={setTargetMessageTemplate}
                                />
                            )}
                    </div>
                    :
                    <EmptySection />
                }
            </div>
        </div>
}

export default MessagesTemplatesPage