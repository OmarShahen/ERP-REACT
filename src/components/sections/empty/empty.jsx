import './empty.css'
import AddIcon from '@mui/icons-material/Add'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import { useNavigate } from 'react-router-dom'


const EmptySection = ({ setIsShowForm, url }) => {

    const navigate = useNavigate()

    return <div className="empty-section-container">
        <div className="empty-section-body-container">
            <div className="empty-section-icon-container">
                <InboxOutlinedIcon />
            </div>
            <span>Oops! No results found</span>
        </div>
        {
            !url && !setIsShowForm ?
            null
            :
            <button 
            className="normal-button white-text action-color-bg"
            onClick={e => url ? navigate(url) : setIsShowForm(true)}
            >
                <AddIcon />
                Add New
            </button>
        }
    </div>
}

export default EmptySection