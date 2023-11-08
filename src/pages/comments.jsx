import { useState, useEffect } from 'react'
import './prescriptions.css'
import { useNavigate } from "react-router-dom"
import { serverRequest } from "../components/API/request"
import { useSelector } from 'react-redux'
import CircularLoading from '../components/loadings/circular'
import FiltersSection from '../components/sections/filters/filters'
import EmptySection from '../components/sections/empty/empty'
import SearchInput from '../components/inputs/search'
import { searchComments } from '../utils/searches/search-comments'
import { toast } from 'react-hot-toast'
import PageHeader from '../components/sections/page-header'
import { isRolesValid } from '../utils/roles'
import Card from '../components/cards/card'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import { formatNumber } from '../utils/numbers'
import translations from '../i18n'
import CommentCard from '../components/cards/comment'
import CommentDeleteConfirmationModal from '../components/modals/confirmation/comment-delete-confirmation-modal'
import CommentFormModal from '../components/modals/comment-form'
import FloatingButton from '../components/buttons/floating-button'


const CommentsPage = ({ roles }) => {

    const navigate = useNavigate()

    const [isUpdate, setIsUpdate] = useState(false)
    const [targetComment, setTargetComment] = useState({})
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isShowAddModal, setIsShowAddModal] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [comments, setComments] = useState([])
    const [searchedComments, setSearchedComments] = useState([])

    const [viewStatus, setViewStatus] = useState('ALL')

    const [statsQuery, setStatsQuery] = useState({})

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const activeElementColor = { border: '2px solid #4c83ee', color: '#4c83ee' }

    useEffect(() => {
        isRolesValid(user.roles, roles) ? null : navigate('/login')
        scroll(0,0)
    }, [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/comments`, { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            const data = response.data
            setComments(data.comments)
            setSearchedComments(data.comments)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }, [reload, statsQuery])

 
    return <div className="page-container page-white-background">
        { 
            isShowDeleteModal ? 
            <CommentDeleteConfirmationModal 
            comment={targetComment}
            reload={reload}
            setReload={setReload} 
            setIsShowModal={setIsShowDeleteModal}
            /> 
            : 
            null 
        }
        {
            isShowAddModal ?
            <CommentFormModal 
            setShowModalForm={setIsShowAddModal}
            reload={reload}
            setReload={setReload}
            setIsUpdate={setIsUpdate}
            isUpdate={isUpdate}
            comment={targetComment}
            />
            :
            null
        }
        <div className="show-mobile">
            <FloatingButton setIsShowForm={setIsShowAddModal} />
        </div>
        <div className="padded-container">
            <PageHeader
            pageName={'Comments'}
            reload={reload}
            setReload={setReload}
            addBtnText={'Add Comment'}
            setShowModalForm={setIsShowAddModal}
            />
            <div className="cards-list-wrapper margin-bottom-1">
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={'Comments'}
                number={formatNumber(comments.length)}
                iconColor={'#5C60F5'}
                />
            </div>
            <FiltersSection 
            setStatsQuery={setStatsQuery} 
            statsQuery={statsQuery}
            defaultValue={'-7'}
            />
            <div className="search-input-container">
                <SearchInput 
                rows={comments} 
                setRows={setSearchedComments}
                searchRows={searchComments}
                isHideClinics={true}
                isCustomClincis={false}
                />
            </div>
            <div className="appointments-categories-container cards-list-wrapper">
                    <div style={ viewStatus === 'ALL' ? activeElementColor : null } onClick={e => {
                        setViewStatus('ALL')
                        setSearchedComments(comments.filter(comment => true))
                    }}>
                        All
                    </div>
                    <div style={ viewStatus === 'ISSUE' ?  activeElementColor : null } onClick={e => {
                        setViewStatus('ISSUE')
                        setSearchedComments(comments.filter(comment => comment.type === 'ISSUE'))
                    }}>
                        Issue
                    </div>
                    <div style={ viewStatus === 'COMPLIMENT' ?  activeElementColor : null } onClick={e => {
                        setViewStatus('COMPLIMENT')
                        setSearchedComments(comments.filter(comment => comment.type === 'COMPLIMENT'))
                    }}>
                        Compliment
                    </div>
                    
                </div>
            {
                isLoading ?
                <CircularLoading />
                :
                searchedComments.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                    { searchedComments.map(comment => <CommentCard 
                    comment={comment} 
                    setReload={setReload}
                    reload={reload}
                    setIsUpdate={setIsUpdate}
                    setShowFormModal={setIsShowAddModal}
                    setTargetComment={setTargetComment}
                    setIsShowDeleteModal={setIsShowDeleteModal}
                    />) }
                </div>
                :
                <EmptySection />
            }
        </div>
        
    </div>
}

export default CommentsPage