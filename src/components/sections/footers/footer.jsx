import { NavLink } from "react-router-dom"
import './footer.css'
import CopyrightOutlinedIcon from '@mui/icons-material/CopyrightOutlined'
import translations from '../../../i18n'
import { useSelector } from 'react-redux'

const FooterSection = () => {

    const lang = useSelector(state => state.lang.lang)

    return <div className="page-footer-container body-text">
        <ul className="show-large">
            <li className="show-large">
                <NavLink to="/support">{translations[lang]['Support']}</NavLink>
            </li>
            <li className="show-large">
                <NavLink>{translations[lang]['Help Center']}</NavLink>
            </li>
            <li className="show-large">
                <NavLink>{translations[lang]['Privacy']}</NavLink>
            </li>
            <li className="show-large">
                <NavLink>{translations[lang]['Terms of service']}</NavLink>
            </li>
        </ul>
        <div className="copy-right-container">
            <CopyrightOutlinedIcon />
            <span>
                2024 - Agile
            </span>
        </div>
    </div>
}

export default FooterSection