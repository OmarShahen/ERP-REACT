import './sections.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import CachedIcon from '@mui/icons-material/Cached'
import { useSelector } from 'react-redux'
import CountUp from 'react-countup'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'


const PageHeader = ({ 
    pageName, 
    addBtnText, 
    addBtnTextIcon,
    addBtnText2,
    addBtnText2Icon,
    setShowModalForm,
    setShowModalForm2, 
    button2Action,
    formURL, 
    setReload, 
    reload, 
    isHideRefresh=false,
    isHideBackButton,
    totalNumber=0
}) => {

    const navigate = useNavigate()

    return <div className="page-header-wrapper">
        {
            isHideBackButton ?
            null
            :
            <div className="back-button-container">
                <ArrowForwardIcon />
                <span onClick={e => navigate(-1)}>الرجوع</span>
            </div>
        }
            <div className="page-header-container">
                <div className="page-header-title-container">
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
                    <h1>
                        {pageName}
                    </h1>
                </div>
                <div className="header-buttons-container">
                    {
                        addBtnText ?
                        <div 
                        className="btns-container subheader-text" 
                        onClick={e => formURL ? navigate(formURL) : setShowModalForm(true)}
                        >
                            <button>
                                <strong>{addBtnText}</strong>
                                { addBtnTextIcon ? addBtnTextIcon : <AddOutlinedIcon /> }
                            </button>
                        </div>
                        :
                        null
                    }
                    {
                        addBtnText2 ?
                        <div className="btns-container subheader-text">
                            <button 
                            onClick={() => { 
                                button2Action()
                            }}
                            >
                                { addBtnText2Icon ? addBtnText2Icon : <AddOutlinedIcon /> }
                                <strong>{addBtnText2}</strong>
                            </button>
                        </div>
                        :
                        null
                    }
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
                </div>
                
        </div>
    </div>
}

export default PageHeader