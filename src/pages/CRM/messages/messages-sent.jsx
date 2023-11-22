import { useState, useEffect } from 'react'
import '../../prescriptions.css'
import { serverRequest } from "../../../components/API/request"
import CircularLoading from '../../../components/loadings/circular'
import FloatingButton from '../../../components/buttons/floating-button'
import EmptySection from '../../../components/sections/empty/empty'
import SearchInput from '../../../components/inputs/search'
import { searchMessagesSent } from '../../../utils/searches/search-messages-sent'
import { toast } from 'react-hot-toast'
import FiltersSection from '../../../components/sections/filters/filters'
import PageHeader from '../../../components/sections/page-header'
import MessageTemplateCard from '../../../components/cards/crm/messages-templates'
import MessageTemplateDeleteConfirmationModal from '../../../components/modals/confirmation/crm/message-template-delete-confirmation-modal'
import MessageTemplateFormModal from '../../../components/modals/message-template-form'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import Card from '../../../components/cards/card'
import { formatNumber } from '../../../utils/numbers'
import MessageSentCard from '../../../components/cards/crm/messages-sent'
import MessageSentDeleteConfirmationModal from '../../../components/modals/confirmation/crm/message-sent-confirmation-modal'
import MessageSentFormModal from '../../../components/modals/message-sent-form'


const MessagesSentPage = ({ roles }) => {

    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isShowAddModal, setIsShowAddModal] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const [targetMessageSent, setTargetMessageSent] = useState({})

    const [reload, setReload] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [messagesSent, setMessagesSent] = useState([])
    const [searchedMessagesSent, setSearchedMessagesSent] = useState([])

    const [statsQuery, setStatsQuery] = useState({})


    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/crm/messages-sent`,  { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            setMessagesSent(response.data.messagesSent)
            setSearchedMessagesSent(response.data.messagesSent)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload, statsQuery])


    return <div className="page-container page-white-background">
        {
            isShowAddModal ?
            <MessageSentFormModal 
            reload={reload} 
            setReload={setReload} 
            setShowFormModal={setIsShowAddModal}  
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
            messageSent={targetMessageSent}
            setMessageSent={setTargetMessageSent}
            />
            :
            null
        }
        {
            isShowDeleteModal ?
            <MessageSentDeleteConfirmationModal
            reload={reload}
            setReload={setReload}
            messageSent={targetMessageSent}
            setIsShowModal={setIsShowDeleteModal}
            />
            :
            null
        }

        <div className="show-mobile">
            <FloatingButton setIsShowForm={setIsShowAddModal} />
        </div>

        <div className="padded-container">
                            
            <PageHeader 
            pageName={'Messages Sent'}
            addBtnText={'Add Message'}
            setReload={setReload}
            reload={reload}
            setShowModalForm={setIsShowAddModal}
            />
            <div className="cards-3-list-wrapper margin-bottom-1">
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={'Messages'}
                number={formatNumber(searchedMessagesSent.length)}
                iconColor={'#5C60F5'}
                />
            </div>
            <FiltersSection 
            setStatsQuery={setStatsQuery} 
            statsQuery={statsQuery}
            defaultValue={'LIFETIME'}
            />
            <div className="search-input-container">
                <SearchInput 
                rows={messagesSent} 
                setRows={setSearchedMessagesSent}
                searchRows={searchMessagesSent}
                isHideClinics={true}
                />
            </div>
                    
                {
                    isLoading ?
                    <CircularLoading />
                    :
                    searchedMessagesSent.length !== 0 ?
                    <div className="cards-grey-container cards-3-list-wrapper">
                            {searchedMessagesSent.map((message, index) => <MessageSentCard 
                                messageSent={message} 
                                setReload={setReload} 
                                reload={reload}
                                setIsUpdate={setIsUpdate}
                                setIsShowUpdateModal={setIsShowAddModal}
                                setIsShowDeleteModal={setIsShowDeleteModal}
                                setTargetMessageSent={setTargetMessageSent}
                                />
                            )}
                    </div>
                    :
                    <EmptySection />
                }
            </div>
        </div>
}

export default MessagesSentPage