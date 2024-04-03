import { useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { capitalizeFirstLetter } from '../../utils/formatString'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import CardImage from '../cards/components/image'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'
import { projectStorage } from '../../../firebase/config'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'


const ExpertProfileFormModal = ({ reload, setReload, setShowModalForm, expert }) => {

    const [isSubmit, setIsSubmit] = useState(false)

    const [title, setTitle] = useState(expert.title)
    const [description, setDescription] = useState(expert.description)
    const [meetingLink, setMeetingLink] = useState(expert.meetingLink)
    const [price, setPrice] = useState(expert.sessionPrice)
    
    const [titleError, setTitleError] = useState()
    const [descriptionError, setDescriptionError] = useState()
    const [imageError, setImageError] = useState()
    const [meetingLinkError, setMeetingLinkError] = useState()
    const [priceError, setPriceError] = useState()

    const [isImageUploading, setIsImageUploading] = useState(false)
    const [imageURL, setImageURL] = useState(expert.profileImageURL)
    const [progresspercent, setProgresspercent] = useState(0)

    const stripHTMLTags = (htmlString) => {
        return htmlString.replace(/<[^>]*>/g, '')
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()

        if(!title) return setTitleError('Title is required')

        if(!meetingLink) return setMeetingLinkError('Meeting link is required')

        if(!price) return setPriceError('Session price is required')

        if(!stripHTMLTags(description)) return setDescriptionError('Description is required')

        const updatedData = {
            title, 
            meetingLink,
            sessionPrice: Number.parseInt(price),
            description
        }

        setIsSubmit(true)
        serverRequest.put(`/v1/experts/${expert._id}`, updatedData)
        .then(response => {
            setIsSubmit(false)
            setReload(reload + 1)
            setShowModalForm(false)
            toast.success(response.data.message, { duration:3000, position: 'top-right' })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }

    const handleImageUpload = (e) => {
        e.preventDefault()

        const file = e.target?.files[0]

        if(!file) return
        
        setIsImageUploading(true)

        const storage = getStorage()
        const storageRef = ref(storage, `/profile-images/${expert._id}/${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file)

        uploadTask.on("state_changed",
        (snapshot) => {
            const progress =
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            setProgresspercent(progress)
        },
        (error) => {
            alert(error)
            setIsImageUploading(false)
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageURL(downloadURL)

            serverRequest.patch(`/v1/users/${expert._id}/profile-image`, { profileImageURL: downloadURL })
            .then(response => {
                setIsImageUploading(false)
                setReload(reload + 1)
                toast.success(response.data.message, { duration: 3000, position: 'top-right' })
            })
            .catch(error => {
                console.error(error)
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
            })
        })
        }
    )

    }

    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>Expert #{expert.userId}</h2>
            </div>
            <div className="modal-body-container">
                <form 
                id="expert-form" 
                className="modal-form-container responsive-form body-text" 
                onSubmit={handleSubmit}
                >
                    <div className="form-input-container">
                        <label></label>
                            <div className="flex-space-between">
                                <CardImage 
                                name={expert.firstName} 
                                imageURL={imageURL} 
                                borderRadius={'50%'} 
                                width={'4rem'} 
                                height={'4rem'} 
                                />
                                <input 
                                type="file"
                                accept="image/*"
                                id="profile-image-input"
                                onChange={handleImageUpload}
                                />
                            <div>
                            <label 
                            for="profile-image-input" 
                            className="button white-text flex-space-between-center">
                                <FileUploadOutlinedIcon />
                                Upload Image
                            </label>
                            </div>
                        </div>
                        {
                            !isImageUploading ?
                            null
                            :
                            <div className="outerbar">
                                <progress className="full-width main-color-bg" max="100" value={progresspercent} />
                            </div>
                        }
                        <span className="red-text">{imageError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Title</label>
                        <input 
                        type="text"
                        className="form-input" 
                        placeholder=""
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        onClick={e => setTitleError()}
                        />
                        <span className="red">{titleError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Meeting Link</label>
                        <input 
                        type="url"
                        className="form-input" 
                        placeholder=""
                        value={meetingLink}
                        onChange={e => setMeetingLink(e.target.value)}
                        onClick={() => setMeetingLinkError()}
                        />
                        <span className="red">{meetingLinkError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Session Price</label>
                        <input 
                        type="number"
                        className="form-input" 
                        placeholder=""
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        onClick={() => setPriceError()}
                        />
                        <span className="red">{priceError}</span>
                    </div>
                </form>
                <div className="form-input-container">
                    <label>Description</label>
                    <ReactQuill 
                    theme="snow"
                    value={description}
                    onChange={setDescription}
                    />
                    <span className="red">{descriptionError}</span>   
                </div>
            </div>
            <div className="modal-form-btn-container">
                <div>
                    {
                        isSubmit ?
                        <TailSpin width="25" height="25" color="#4c83ee" />
                        :
                        <button 
                        form="expert-form"
                        className="normal-button white-text action-color-bg"
                        >Update</button>
                    }
                </div>
                <div>
                    <button 
                    className="normal-button cancel-button"
                    onClick={() => {
                        setShowModalForm(false)
                    }}
                    >Close</button>
                </div>
            </div>
        </div>
    </div>
}

export default ExpertProfileFormModal