import CardImage from '../../cards/components/image'
import './search.css'
import CloseIcon from '@mui/icons-material/Close'


const SearchMenu = ({ leads, setLead, setLeads, setSearchName }) => {

    return <div className="search-menu-container">
        <div className="search-menu-header-container">
            <span>Leads</span>
            <div onClick={e => {
                setLead()
                setSearchName()
                setLeads([])
            }}>
                <CloseIcon />
            </div>
        </div>
        <div className="search-list-container">
            <ul>
                {leads.map(lead => <li 
                onClick={e => { 
                    setLead(lead) 
                    setSearchName(lead.name)
                    setLeads([])
                }}
                className="search-list-item-container"
                >
                    <div>
                        <div className="image-container">
                            <CardImage name={lead.name} />
                        </div>
                        <div className="search-list-item-description">
                            <strong className="body-text">{lead.name}</strong>
                            <span className="span-text bold-text">{lead?.phone ? `+${lead.countryCode}${lead.phone}` : null}</span>
                        </div>
                    </div>
                </li>)}
            </ul>
        </div>
    </div>
}

export default SearchMenu