import SearchIcon from '@mui/icons-material/Search'
import './input.css'

const SearchInput = ({ searchRows }) => { 


    return <div className="right-direction">
        <div className="search-field-input-container">
            <input 
            type="text" 
            className="form-input"
            placeholder={"البحث"}
            onChange={e => searchRows(e.target.value)}
            />
            <span>
                <SearchIcon />
            </span>
        </div>
        
    </div>
}

export default SearchInput