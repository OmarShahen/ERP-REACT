import { NavLink, useNavigate } from 'react-router-dom'
import './sidebar.css'
import { useDispatch, useSelector } from 'react-redux'
import { setIsShowSidebar } from '../../redux/slices/sidebarSlice'
import { motion, AnimatePresence } from "framer-motion";
import logoImage from '../../assets/memories.png'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined'
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { setIsLogged } from '../../redux/slices/userSlice'
import TurnedInNotOutlinedIcon from '@mui/icons-material/TurnedInNotOutlined'
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined'


const SideBar = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector(state => state.user.user)
    

    return <div className="side-bar-container body-text">
        <AnimatePresence>
      <motion.div
        className="sidebar"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3 }}
      >
        <div className="side-bar-arrow-container show-mobile">
            <span onClick={e => dispatch(setIsShowSidebar(false))}>
                <ArrowForwardIcon />
            </span>
        </div>
        <div className="center side-bar-logo-container">
            <img src={logoImage} />
        </div>
        <ul className="nav-nested-list-container">
            {
                user.type === 'ADMIN' ?
                <li>
                    <div>
                        <NavLink to="/dashboard">
                            <InsertChartOutlinedIcon />
                            لوحة التحكم
                        </NavLink>
                    </div>
                </li>
                :
                null
            }
            <li>
                <div>
                    <NavLink to="/pos">
                        <PointOfSaleOutlinedIcon />
                        نقطة البيع
                    </NavLink>
                </div>
            </li>
            <li>
                <div>
                    <NavLink to="/orders">
                        <ReceiptOutlinedIcon />
                        الطلبات
                    </NavLink>
                </div>
            </li>
            <li>
                <div>
                    <NavLink to="/items">
                        <CakeOutlinedIcon />
                        المنتجات
                    </NavLink>
                </div>
            </li>
            <li>
                <div>
                    <NavLink to="/stock-records">
                        <InventoryOutlinedIcon />
                        حركة المخزن
                    </NavLink>
                </div>
            </li>
            {
                user.type === 'ADMIN' ?
                <li>
                    <div>
                        <NavLink to="/employees">
                            <BadgeOutlinedIcon />
                            الموظفين
                        </NavLink>
                    </div>
                </li>
                :
                null
            }
            <li>
                <div>
                    <NavLink to="/specialties">
                        <TurnedInNotOutlinedIcon />
                        الفئات
                    </NavLink>
                </div>
            </li>
            <li>
                <div>
                    <NavLink to="/" 
                    onClick={e => {
                        e.preventDefault()
                        sessionStorage.setItem('user', null)
                        dispatch(setIsLogged(false))
                        navigate('/login')
                    }}>
                        <LogoutOutlinedIcon />
                        الخروج
                    </NavLink>
                </div>
            </li>
            
        </ul>
    </motion.div>
    </AnimatePresence>
    </div>
}

export default SideBar