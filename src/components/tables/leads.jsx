import { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { getAge } from "../../utils/age-calculator"
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { useSelector } from "react-redux"


const LeadsTable = ({ rows, setReload, reload }) => {

    const navigate = useNavigate()
    const user = useSelector(state => state.user.user)
    const [searchedRows, setSearchedRows] = useState(rows)

    useEffect(() => setSearchedRows(rows), [rows])

    const searchRows = (patient, value) => {

        const name = `${patient.firstName} ${patient.lastName}`.toLowerCase()
        const phone = `${patient.countryCode}${patient.phone}`
        const cardId = `${patient.cardId}`

        if(name.includes(value.toLowerCase())) {
            return true
        } else if(phone.includes(value)) {
            return true
        } else if(cardId.includes(value)) {
            return true
        }

        return false
    }

    const deletePatient = (patientId, doctorId) => {

        serverRequest.delete(`/v1/patients/${patientId}/doctors/${doctorId}`)
        .then(response => {
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            setReload(reload+1)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.data.response.message, { position: 'top-right', duration: 3000 })
        })
    }

    return <div>
            <div className="table-container body-text">
                <div className="table-filters-container">
                    <div className="table-name-container">
                        <strong>Patients</strong>
                    </div>
                    <div className="table-search-input-container">
                        <span><SearchIcon /></span>
                        <input 
                        type="search" 
                        className="form-input" 
                        placeholder="search patients..."
                        onChange={e => setSearchedRows(rows.filter(row => searchRows(row, e.target.value)))}
                        />
                    </div>
                    <div className="refresh-button-container">
                        <button
                        onClick={e => setReload(reload+1)}
                        className="normal-button action-color-bg white-text icon-button">
                            <RefreshIcon />
                            Refresh
                        </button>
                    </div>
                </div>
                <table>
                    <tr className="table-header-rows">
                        <th>Name</th>
                        <th>Card ID</th>
                        <th>Phone</th>
                        <th>Gender</th>
                        <th>Age</th>
                        <th>Registration Date</th>
                        <th>Actions</th>
                    </tr>
                    
                    {
                        searchedRows.slice(0, 20).map(row => <tr>
                            <td>{`${row.firstName} ${row.lastName}`}</td>
                            <td>#{row.cardId}</td>
                            <td>{`+${row.countryCode}${row.phone}`}</td>
                            <td>{row.gender}</td>
                            <td>{row.dateOfBirth ? getAge(row.dateOfBirth) : 'Not Registered'}</td>
                            <td>{format(new Date(row.createdAt), 'dd MMM yyyy')}</td>
                            <td>
                            <div className="small-description-text actions-container">    
                                <div>
                                    <span onClick={e => navigate(`/patients/${row._id}/medical-profile`)}><RemoveRedEyeOutlinedIcon /></span>
                                </div>
                                <div>
                                    <span><CreateOutlinedIcon /></span>
                                </div>
                                <div>
                                    <span onClick={e => deletePatient(row._id, user._id)}><DeleteOutlineOutlinedIcon /></span>
                                </div>
                            </div>
                        </td>
                        </tr>)
                    }
                </table>
            <div className="table-footer grey-text">
                <p>{searchedRows.length} results found</p>
            </div>
        </div>
    </div>
}

export default LeadsTable