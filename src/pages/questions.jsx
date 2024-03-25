import { useState, useEffect } from 'react'
import './prescriptions.css'
import PageHeader from '../components/sections/page-header'
import { serverRequest } from '../components/API/request'
import CircularLoading from '../components/loadings/circular'
import { useSelector } from 'react-redux'
import EmptySection from '../components/sections/empty/empty'
import { useNavigate } from 'react-router-dom'
import { isRolesValid } from '../utils/roles'
import DeleteConfirmationModal from '../components/modals/confirmation/delete-confirmation-modal'
import { toast } from 'react-hot-toast'
import SelectInputField from '../components/inputs/select'
import QuestionCard from '../components/cards/question'
import QuestionFormModal from '../components/modals/question-form'


const QuestionsPage = ({ roles }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)
    
    const [isShowModal, setIsShowModal] = useState(false)
    const [target, setTarget] = useState({})

    const [isUpdate, setIsUpdate] = useState(false)
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)

    const [isDeleting, setIsDeleting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [questions, setQuestions] = useState([])

    const [specialities, setSpecialities] = useState([])
    const [speciality, setSpeciality] = useState()

    const [name, setName] = useState()

    useEffect(() => {
        isRolesValid(user.roles, roles) ? null : navigate('/login')
        scroll(0, 0)
    }, [])

    useEffect(() => {
        serverRequest.get('/v1/specialities')
        .then(response => {
            let specialities = response.data.specialities
            specialities = [{ name: 'All', _id: 'ALL' }, ...specialities]
            setSpecialities(specialities)
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }, [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/issues`, { params: { name } })
        .then(response => {
            setIsLoading(false)
            setQuestions(response.data.issues)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload, name])


    const filterQuestionsBySpeciality = (specialityId) => {
        setIsLoading(true)
        serverRequest.get(`/v1/issues/specialities/${specialityId}`)
        .then(response => {
            setIsLoading(false)
            setQuestions(response.data.issues)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }

    const deleteQuestion = (questionId) => {
        setIsDeleting(true)
        serverRequest.delete(`/v1/issues/${questionId}`)
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
            deleteAction={deleteQuestion}
            />
            :
            null
        }
        {
            isShowModal ?
            <QuestionFormModal 
            reload={reload}
            setReload={setReload}
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
            setShowModalForm={setIsShowModal}
            question={target}
            />
            :
            null
        }
        
        <div className="padded-container">
            <PageHeader 
            pageName={'Questions'} 
            reload={reload}
            setReload={setReload}
            addBtnText={'Add Question'}
            setShowModalForm={setIsShowModal}
            />
            <div className="cards-3-list-wrapper margin-bottom-1">
                <SelectInputField 
                selectLabel='Select Speciality'
                options={specialities}
                isNested={true}
                actionFunction={(specialityId) => {
                    if(specialityId === 'ALL') {
                        setReload(reload + 1)
                        return
                    }
                    filterQuestionsBySpeciality(specialityId)
                }}
                />
                <input 
                type="search"
                className="form-input"
                placeholder="Search Questions..."
                onChange={e => setName(e.target.value)}
                />
            </div>
            
            {
                isLoading ?
                <CircularLoading />
                :
                questions.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                    {questions.map(question =><QuestionCard 
                    question={question} 
                    setReload={setReload} 
                    reload={reload} 
                    setTarget={setTarget}
                    setIsShowDelete={setIsShowDeleteModal}
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

export default QuestionsPage