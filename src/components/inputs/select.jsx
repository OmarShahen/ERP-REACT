import { capitalizeFirstLetter } from "../../utils/formatString"

const SelectInputField = ({ label, selectLabel='Select', options=[], actionFunction }) => {

    return <div className="form-input-container">
        { label ? <label>{label}</label> : null }
        <select
        className="form-input"
        onChange={e => actionFunction(e.target.value)}
        >
            <option selected disabled>{selectLabel}</option>
            {options.map(option => {
                return <option value={option}>{capitalizeFirstLetter(option)}</option>
            })}
        </select>
    </div>
}

export default SelectInputField