
const InputField = ({ label, type='text' }) => {

    return <div className="form-input-container">
        { label ? <label>{label}</label> : null }
        <input 
        className="form-input"
        type={type}
        />
        <span className="red"></span>
    </div>
}

export default InputField