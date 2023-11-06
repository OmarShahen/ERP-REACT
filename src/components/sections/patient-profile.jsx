import { useState } from 'react'
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined'
import SmokingRoomsOutlinedIcon from '@mui/icons-material/SmokingRoomsOutlined'
import ElderlyOutlinedIcon from '@mui/icons-material/ElderlyOutlined'
import CoronavirusOutlinedIcon from '@mui/icons-material/CoronavirusOutlined'
import BloodtypeOutlinedIcon from '@mui/icons-material/BloodtypeOutlined'
import MacroOffOutlinedIcon from '@mui/icons-material/MacroOffOutlined'
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined'
import VaccinesOutlinedIcon from '@mui/icons-material/VaccinesOutlined'
import { getAge } from '../../utils/age-calculator'
import { capitalizeFirstLetter } from '../../utils/formatString'
import translations from '../../i18n'
import { useSelector } from 'react-redux'


const PatientProfileSection = ({ patient }) => {

    const lang = useSelector(state => state.lang.lang)

    const [demographic, setDemographic] = useState(true)
    const [emergencyContacts, setEmergencyContacts] = useState(true)
    const [badHabits, setBadHabits] = useState(true)
    const [chronicDiseases, setChronicDiseases] = useState(true)
    const [geneticIssue, setGeneticIssue] = useState(true)
    const [blood, setBlood] = useState(true)
    const [allergy, setAllergy] = useState(true)
    const [immune, setImmune] = useState(true)
    const [surgery, setSurgery] = useState(true)

    const formatValue = (value) => {

        if(typeof value !== 'boolean') {
            return 'Not Registered'
        } else if(value === true) {
            return 'Yes'
        } else if(value === false) {
            return 'No'
        }
    }

    return <div>

    <div className="cards-grey-container">
        <div className="information-list-container" id="demographic-section">
            <div className="information-list-header">
                <div className="header-and-icon-container">
                    <h2 className="subheader-text">
                        {translations[lang]['Personal Information']}
                    </h2>
                    <span className="icon-container pending">
                        <Person2OutlinedIcon />
                    </span>
                </div>
            </div>
            {
                demographic ?
                <ul className="body-text">
                <li>
                    <div className="bold-text">
                        {translations[lang]['Name']}
                    </div>
                    <div>
                        {patient.firstName ? `${patient.firstName} ${patient.lastName ? patient.lastName : ''}` : translations[lang]['Not Registered'] }
                    </div>
                </li>
                <li>
                    <div className="bold-text">
                        {translations[lang]['Phone']}
                    </div>
                    <div>
                    {patient.countryCode && patient.phone ? `+${patient.countryCode}${patient.phone}` : translations[lang]['Not Registered'] }
                    </div>
                </li>
                <li>
                    <div className="bold-text">
                        {translations[lang]['City']}
                    </div>
                    <div>
                        { patient.city ? translations[lang][capitalizeFirstLetter(patient.city)] : translations[lang]['Not Registered'] }
                    </div>
                </li>
                <li>
                    <div className="bold-text">
                        {translations[lang]['Gender']}
                    </div>
                    <div>
                        { patient.gender ? translations[lang][capitalizeFirstLetter(patient.gender)] : translations[lang]['Not Registered'] }
                    </div>
                </li>
                <li>
                    <div className="bold-text">
                        {translations[lang]['Social Status']}
                    </div>
                    <div>
                        {patient.socialStatus ? translations[lang][capitalizeFirstLetter(patient.socialStatus)] : translations[lang]['Not Registered']}
                    </div>
                </li>
                <li>
                    <div className="bold-text">
                        {translations[lang]['Age']}
                    </div>
                    <div>
                        {patient.dateOfBirth ? getAge(patient.dateOfBirth) : translations[lang]['Not Registered']}
                    </div>
                </li>
                </ul>
                :
                null
            }
            
        </div>
    </div>
    </div>
}

export default PatientProfileSection