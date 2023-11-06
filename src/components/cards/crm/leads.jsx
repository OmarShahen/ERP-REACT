import '../patient.css'
import CardDate from '../components/date'
import CardActions from '../components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import CardTransition from '../../transitions/card-transitions'
import { capitalizeFirstLetter } from '../../../utils/formatString'
import { formatMoney } from '../../../utils/numbers'



const LeadCard = ({ 
    lead, 
    setTargetLead,
    setIsUpdate,
    setIsShowUpdateLead,
    setIsShowDeleteLead,
}) => {

    const leadPhone = `+${lead.countryCode}${lead.phone}`

    const cardActionsList = [
        {
            name: 'Delete Lead',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetLead(lead)
                setIsShowDeleteLead(true)
            }
        },
        {
            name: 'Update Lead',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setIsUpdate(true)
                setTargetLead(lead)
                setIsShowUpdateLead(true)
            }
        }
     ]

     const renderLeadStage = (stage) => {

        if(stage === 'NEGOTIATION') {
            return <span className="status-btn done bold-text">{capitalizeFirstLetter(stage)}</span>
        } else if(stage === 'UNQUALIFIED') {
            return <span className="status-btn declined bold-text">{capitalizeFirstLetter(stage)}</span>         
        } else if(stage === 'QUALIFIED') {
            return <span className="status-btn pending bold-text">{capitalizeFirstLetter(stage)}</span>      
        } else if(stage === 'NEEDS-DETAILS') {
            return <span className="status-btn tag-purple-bg white-text bold-text">{capitalizeFirstLetter(stage)}</span>      
        } else if(stage === 'MEETING') {
            return <span className="status-btn tag-green-bg white-text bold-text">{capitalizeFirstLetter(stage)}</span>    
        }  else if(stage === 'FOLLOW-UP') {
            return <span className="status-btn tag-cyan-bg white-text bold-text">{capitalizeFirstLetter(stage)}</span>    
        } else {
            return <span className="status-btn grey-bg bold-text">{capitalizeFirstLetter(stage)}</span>
        }
    }

    const renderLeadStatus = (stage) => {

        if(stage === 'WON') {
            return <span className="status-btn done bold-text">{capitalizeFirstLetter(stage)}</span>
        } else if(stage === 'LOST') {
            return <span className="status-btn declined bold-text">{capitalizeFirstLetter(stage)}</span>         
        } else if(stage === 'OPENED') {
            return <span className="status-btn pending bold-text">{capitalizeFirstLetter(stage)}</span>      
        } else {
            return <span className="status-btn grey-bg bold-text">{capitalizeFirstLetter(stage)}</span>
        }
    }

    return <CardTransition>
        <div 
        onClick={e => {
            e.stopPropagation()
            setIsUpdate(true)
            setTargetLead(lead)
            setIsShowUpdateLead(true)
        }}
        className="patient-card-container body-text">
            <div className="patient-card-header">
                <div className="patient-image-info-container">
                    <img src={`https://avatars.dicebear.com/api/initials/${lead.name}.svg`} alt="lead-image" />
                    <div>
                        <strong>{lead.name}</strong>
                        <span className="grey-text">#{lead.leadId}</span>
                    </div>
                </div>
                <CardActions actions={cardActionsList} />
            </div>
            <div className="patient-card-body">
                <ul>
                    <li>
                        <strong>Name</strong>
                        <span>{lead.name}</span>
                    </li>
                    <li>
                        <strong>Phone</strong>
                        <span>{leadPhone}</span>
                    </li>
                    <li>
                        <strong>Status</strong>
                        <span>{lead?.status ? renderLeadStatus(lead?.status) : null}</span>
                    </li>
                    <li>
                        <strong>Value</strong>
                        <span>{lead.value ? formatMoney(lead.value) : formatMoney(0)}</span>
                    </li>
                    <li>
                        <strong>Stage</strong>
                        <span>{lead?.stage ? renderLeadStage(lead?.stage) : null}</span>
                    </li>
                </ul>
            </div>
            <CardDate 
            creationDate={lead.createdAt} 
            updateDate={lead.updatedAt} 
            />
        </div>
    </CardTransition>
}

export default LeadCard