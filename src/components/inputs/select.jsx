import { capitalizeFirstLetter } from "../../utils/formatString"

const SelectInputField = ({ label, selectLabel='Select', options=[], isNested=false, actionFunction }) => {

    return <div className="form-input-container">
        { label ? <label>{label}</label> : null }
        <select
        className="form-input"
        onChange={e => actionFunction(e.target.value)}
        >
            <option selected disabled>{selectLabel}</option>
            {options.map(option => {
                return <option value={isNested ? option._id : option}>{capitalizeFirstLetter(isNested ? option.name : option)}</option>
            })}
        </select>
    </div>
}

export default SelectInputField