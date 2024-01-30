import SearchIcon from '@mui/icons-material/Search'
import './input.css'

const SearchInput = ({ searchRows }) => { 


    return <div className="cards-3-list-wrapper">
        <div className="search-field-input-container">
            <span>
                <SearchIcon />
            </span>
            <input 
            type="text" 
            className="form-input"
            placeholder={"Search..."}
            onChange={e => searchRows(e.target.value)}
            />
        </div>
        
    </div>
}

export default SearchInput