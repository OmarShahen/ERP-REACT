import './sections.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import CachedIcon from '@mui/icons-material/Cached'
import translations from '../../i18n'
import { useSelector } from 'react-redux'
import { formatNumber } from '../../utils/numbers'
import CountUp from 'react-countup'


const PageHeader = ({ 
    pageName, 
    addBtnText, 
    addBtnTextIcon,
    addBtnText2,
    addBtnText2Icon,
    setShowModalForm,
    setShowModalForm2, 
    formURL, 
    setReload, 
    reload, 
    isHideRefresh=false,
    isHideBackButton,
    totalNumber=0
}) => {

    const navigate = useNavigate()
    const lang = useSelector(state => state.lang.lang)

    return <div className="page-header-wrapper">
        {
            isHideBackButton ?
            null
            :
            <div className="back-button-container">
                <ArrowBackIcon />
                <span onClick={e => navigate(-1)}>{translations[lang]['Back']}</span>
            </div>
        }
            <div className="page-header-container">
            <div className="page-header-title-container">
                <h1>
                    {pageName}
                </h1>
                {
                    totalNumber ?
                    <span className="header-number-container">
                        <CountUp 
                        end={totalNumber}
                        duration={1.5}
                        />
                    </span>
                    :
                    null
                }
            </div>
                <div className="header-buttons-container">
                    {
                        isHideRefresh ?
                        null
                        :
                        <div className="header-mobile-icons-container">
                            <div onClick={e => setReload(reload + 1)}>
                                <CachedIcon />
                            </div>
                        </div>
                    }
                    {
                        addBtnText ?
                        <div 
                        className="btns-container subheader-text" 
                        onClick={e => formURL ? navigate(formURL) : setShowModalForm(true)}
                        >
                            {
                                addBtnText2 ?
                                <button 
                                onClick={e => { 
                                    e.stopPropagation()
                                    setShowModalForm2(true)
                                }}
                                >
                                    { addBtnText2Icon ? addBtnText2Icon : <AddOutlinedIcon /> }
                                    <strong>{addBtnText2}</strong>
                                </button>
                                :
                                null
                            }
                            <button>
                                { addBtnTextIcon ? addBtnTextIcon : <AddOutlinedIcon /> }
                                <strong>{addBtnText}</strong>
                            </button>
                        </div>
                        :
                        null
                    }
                </div>
                
        </div>
    </div>
}

export default PageHeader