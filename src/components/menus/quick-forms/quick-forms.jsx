import './quick-forms.css'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import { useSelector } from 'react-redux'
import translations from '../../../i18n'
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import StairsOutlinedIcon from '@mui/icons-material/StairsOutlined'
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'


const QuickFormMenu = ({ 
    setIsShowCommentForm,
    setIsShowLeadForm,
    setIsShowMeetingForm,
    setIsShowStageForm,
    setIsShowMessageTemplateForm,
    setIsShowValuesForm
}) => {

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    return <div className="quick-form-menu-container">
        <div className="quick-form-menu-header-container">
            <span>{translations[lang]['Quick Adds']}</span>
        </div>
        <div className="quick-form-list-container">
            <ul>
                {
                    user.roles.includes('ADMIN') ?
                    <li onClick={e => setIsShowLeadForm(true)}>
                        <span>Lead</span>
                        <PeopleAltOutlinedIcon />
                    </li>
                    :
                    null
                }
                {
                    user.roles.includes('ADMIN') ?
                    <li onClick={e => setIsShowMeetingForm(true)}>
                        <span>Meeting</span>
                        <CalendarMonthOutlinedIcon />
                    </li>
                    :
                    null
                }
                {
                    user.roles.includes('ADMIN') ?
                    <li onClick={e => setIsShowStageForm(true)}>
                        <span>Stage</span>
                        <StairsOutlinedIcon />
                    </li>
                    :
                    null
                }
                {
                    user.roles.includes('ADMIN') ?
                    <li onClick={e => setIsShowMessageTemplateForm(true)}>
                        <span>Message</span>
                        <MessageOutlinedIcon />
                    </li>
                    :
                    null
                }
                <li onClick={e => setIsShowCommentForm(true)}>
                    <span>Comment</span>
                    <MapsUgcOutlinedIcon />
                </li>
                {
                    user.roles.includes('ADMIN') ?
                    <li onClick={e => setIsShowValuesForm(true)}>
                        <span>Values</span>
                        <TuneOutlinedIcon />
                    </li>
                    :
                    null
                }
            </ul>
        </div>
    </div>
}

export default QuickFormMenu