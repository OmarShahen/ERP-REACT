import './quick-forms.css'
import { useSelector } from 'react-redux'
import translations from '../../../i18n'
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined'
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import TurnedInNotOutlinedIcon from '@mui/icons-material/TurnedInNotOutlined'
import { useNavigate } from 'react-router-dom'


const QuickFormMenu = ({ 
    setIsShowItemsForm,
    setIsShowMeetingForm,
    setIsShowStageForm,
    setIsShowOpeningTime
}) => {

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const navigate = useNavigate()

    return <div className="quick-form-menu-container right-direction">
        <div className="quick-form-menu-header-container">
            <span>{translations[lang]['Quick Adds']}</span>
        </div>
        <div className="quick-form-list-container">
            <ul>
                <li onClick={e => navigate('/pos')}>
                    <span>الطلبات</span>
                    <ReceiptOutlinedIcon />
                </li>

                <li onClick={() => setIsShowItemsForm(true)}>
                    <span>المنتجات</span>
                    <CakeOutlinedIcon />
                </li>
                   
            </ul>
        </div>
    </div>
}

export default QuickFormMenu