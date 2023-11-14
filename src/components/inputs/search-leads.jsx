import SearchMenu from "../menus/search/search"
import { useState } from "react"
import { serverRequest } from "../API/request"


const SearchLeadsInputField = ({ 
    setTargetLead, 
    targetLeadError, 
    setTargetLeadError, 
    removeLabel=false,
    placeholder
 }) => {

    const [searchName, setSearchName] = useState()
    const [leadsList, setLeadsList] = useState([])

    const searchLead = (name) => {
        setSearchName(name)
        if(!name) {
            setLeadsList([])
            setTargetLead()
            return
        }

        const endpointURL = `/v1/crm/leads/name/search?name=${name}`

        serverRequest.get(endpointURL)
        .then(response => {
            const leads = response.data.leads
            setLeadsList(leads)
        })
        .catch(error => {
            console.error(error)
        })
    }

    return <div className="form-input-container">
        {
            removeLabel ?
            null
            :
            <label>Lead</label>
        }
        <div className="quick-form-container">
            <input 
            type="text" 
            className="form-input" 
            value={searchName}
            onChange={e => searchLead(e.target.value)}
            onClick={e => setTargetLeadError()}
            placeholder={placeholder ? placeholder : null}
            />
            {
                leadsList.length !== 0 ?
                <SearchMenu 
                leads={leadsList} 
                setLeads={setLeadsList}
                setLead={setTargetLead} 
                setSearchName={setSearchName}
                />
                :
                null
            }
            
        </div>
        <span className="red">{targetLeadError}</span>
        
    </div>
}

export default SearchLeadsInputField