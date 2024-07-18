import SearchMenu from "../menus/search/search"
import { useState } from "react"
import { serverRequest } from "../API/request"


const SearchItemsInputField = ({ 
    setTargetItem, 
    targetItemError, 
    setTargetItemError, 
    removeLabel=true,
    placeholder
 }) => {

    const [searchName, setSearchName] = useState()
    const [itemsList, setItemsList] = useState([])

    const searchItem = (name) => {
        setSearchName(name)
        if(!name) {
            setItemsList([])
            setTargetItem()
            return
        }

        serverRequest.get(`/v1/items/search/name/category`, { params: { name: name } })
        .then(response => {
            const items = response.data.items
            setItemsList(items)
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
            <label>المنتج</label>
        }
        <div className="quick-form-container">
            <input 
            type="text" 
            className="form-input" 
            value={searchName}
            onChange={e => searchItem(e.target.value)}
            onClick={e => setTargetItemError()}
            placeholder={placeholder ? placeholder : null}
            />
            {
                itemsList.length !== 0 ?
                <SearchMenu 
                items={itemsList} 
                setItems={setItemsList}
                setItem={setTargetItem} 
                setSearchName={setSearchName}
                />
                :
                null
            }
            
        </div>
        <span className="red">{targetItemError}</span>
        
    </div>
}

export default SearchItemsInputField