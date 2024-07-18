import './search.css'
import CloseIcon from '@mui/icons-material/Close'


const SearchMenu = ({ items, setItem, setItems, setSearchName }) => {

    return <div className="search-menu-container">
        <div className="search-menu-header-container">
            <span>المنتجات</span>
            <div onClick={e => {
                setItem()
                setSearchName()
                setItems([])
            }}>
                <CloseIcon />
            </div>
        </div>
        <div className="search-list-container">
            <ul>
                {items.map(item => <li 
                onClick={e => { 
                    setItem(item._id) 
                    setSearchName(item.name)
                    setItems([])
                }}
                className="search-list-item-container"
                >
                    <div>
                        <div className="search-list-item-description">
                            <strong className="body-text">{item.name}</strong>
                        </div>
                    </div>
                </li>)}
            </ul>
        </div>
    </div>
}

export default SearchMenu