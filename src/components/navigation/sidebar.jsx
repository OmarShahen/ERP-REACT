import { NavLink } from 'react-router-dom'
import './sidebar.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useDispatch, useSelector } from 'react-redux'
import { setIsShowSidebar } from '../../redux/slices/sidebarSlice'
import { motion, AnimatePresence } from "framer-motion";
import logoImage from '../../assets/memories.png'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
import LoyaltyOutlinedIcon from '@mui/icons-material/LoyaltyOutlined'
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined'
import CarRepairOutlinedIcon from '@mui/icons-material/CarRepairOutlined'


const SideBar = ({ width, isHideText, setHideSideBar }) => {

    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)
    

    return <div className="side-bar-container body-text" style={{ width }}>
        <AnimatePresence>
      <motion.div
        className="sidebar"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.3 }}
      >
        <div className="side-bar-arrow-container show-mobile">
            <span onClick={e => dispatch(setIsShowSidebar(false))}>
                <ArrowBackIcon />
            </span>
        </div>
        <div className="center side-bar-logo-container">
            <img src={logoImage} />
        </div>
        <ul>
            <ul className="nav-nested-list-container">
                <li>
                    <div>
                        <NavLink to="/dashboard">
                            <InsertChartOutlinedIcon />
                            Dashboard
                        </NavLink>
                    </div>
                </li>
                {/*<li>
                    <div>
                        <NavLink to="/payments">
                            <PaymentOutlinedIcon />
                            Payments
                        </NavLink>
                    </div>
                </li>
                <li>
                    <div>
                        <NavLink to="/appointments">
                        <CalendarMonthOutlinedIcon />
                        Appointments
                        </NavLink>
                    </div>
                </li>
                <li>
                    <div>
                        <NavLink to="/users/seekers">
                        <PersonOutlineOutlinedIcon />
                        Seekers
                        </NavLink>
                    </div>
                </li>*/}
                <li>
                    <div>
                        <NavLink to="/brands">
                            <AddBusinessOutlinedIcon />
                            Brands
                        </NavLink>
                    </div>
                </li>
                {/*<li>
                    <div>
                        <NavLink to="/users/experts">
                            <BadgeOutlinedIcon />
                            Experts
                        </NavLink>
                    </div>
                </li>*/}
                <li>
                    <div>
                        <NavLink to="/customers">
                            <BadgeOutlinedIcon />
                            Customers
                        </NavLink>
                    </div>
                </li>
                <li>
                    <div>
                        <NavLink to="/items">
                            <CarRepairOutlinedIcon />
                            Items
                        </NavLink>
                    </div>
                </li>
                <li>
                    <div>
                        <NavLink to="/specialties">
                            <CategoryOutlinedIcon />
                            Specialties
                        </NavLink>
                    </div>
                </li>
                {/*<li>
                    <div>
                        <NavLink to="/reviews">
                            <MapsUgcOutlinedIcon />
                            Reviews
                        </NavLink>
                    </div>
                </li>
                <li>
                    <div>
                        <NavLink to="/experts-verifications">
                            <VerifiedOutlinedIcon />
                            Verifications
                        </NavLink>
                    </div>
                </li>
                <li>
                    <div>
                        <NavLink to="/promo-codes">
                            <LoyaltyOutlinedIcon />
                            Coupons
                        </NavLink>
                    </div>
                </li>
                <li>
                    <div>
                        <NavLink to="/questions">
                            <ContactSupportOutlinedIcon />
                            Questions
                        </NavLink>
                    </div>
                </li>
                <li>
                    <div>
                        <NavLink to="/settings">
                            <SettingsOutlinedIcon />
                            Settings
                        </NavLink>
                    </div>
</li>*/}
            </ul>
        </ul>
    </motion.div>
    </AnimatePresence>
    </div>
}

export default SideBar