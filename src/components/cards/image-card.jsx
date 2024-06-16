import { useState } from "react"
import toast from "react-hot-toast"
import { serverRequest } from "../API/request"
import { TailSpin } from "react-loader-spinner"


const ImageCard = ({ itemId, imageURL, setReload, reload }) => {

    const [isDelete, setIsDelete] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)


    const deleteImage = () => {
        setIsDelete(true)
        serverRequest.patch(`/v1/items/${itemId}/images`, { imageURL })
        .then(response => {
            setIsDelete(false)
            setReload(reload + 1)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            setIsDelete(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }

    const updateImage = () => {
        setIsUpdate(true)
        serverRequest.patch(`/v1/items/${itemId}/main-image`, { mainImage: imageURL })
        .then(response => {
            setIsUpdate(false)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            setIsUpdate(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }

    return <div>
        <div class="image-card-container">
            <img src={imageURL} />
        </div>
        <div className="flex-right margin-top-1">
            {
                isUpdate ?
                <TailSpin width="25" height="25" color="#4c83ee" />
                :
                <button onClick={updateImage} className="normal-button action-color-bg white-text">Set Main</button>
            }
            {
                isDelete ?
                <TailSpin width="25" height="25" color="red" />
                :
                <button onClick={deleteImage} className="normal-button red-bg white-text margin-left-1">Delete</button>
            }
        </div>
    </div>
}

export default ImageCard