import { useState } from 'react'
import './modals.css'


const PickDateFormModal = ({ reload, setReload, setShowModalForm, setStatsQuery, setDatePeriod }) => {

    const [customDateType, setCustomDateType] = useState()

    const [specificDate, setSpecificDate] = useState()
    const [untilDate, setUntilDate] = useState()
    const [fromDate, setFromDate] = useState()
    const [toDate, setToDate] = useState()

    const [customDateError, setCustomDateError] = useState()
    const [specificDateError, setSpecificDateError] = useState()
    const [untilDateError, setUntilDateError] = useState()
    const [fromDateError, setFromDateError] = useState()
    const [toDateError, setToDateError] = useState()

    const handleSubmit = (e) => {
        e.preventDefault()

        if(customDateType === 'SPECIFIC') {

            if(!specificDate) return setSpecificDateError('date is required')

            setStatsQuery({ specific: specificDate })
            setShowModalForm(false)
            setDatePeriod('CUSTOM')
            
        } else if(customDateType === 'UNTIL') {

            if(!untilDate) return setUntilDateError('date is required')

            setStatsQuery({ until: untilDate })
            setShowModalForm(false)
            setDatePeriod('CUSTOM')

        } else if(customDateType === 'FROM-TO') {

            if(!fromDate) return setFromDateError('date is required')

            if(!toDate) return setToDateError('date is required')

            setStatsQuery({ from: fromDate, to: toDate })
            setShowModalForm(false)
            setDatePeriod('CUSTOM')

        }
    }

    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>Pick Date</h2>
            </div>
            <div className="modal-body-container">
                <form className="modal-form-container responsive-form body-text" onSubmit={handleSubmit}>
                    <div className="form-input-container">
                        <label>Custom Date Type</label>
                        <select onChange={e => setCustomDateType(e.target.value)}>
                            <option selected disabled>choose date type</option>
                            <option value="UNTIL">Until Date</option>
                            <option value="FROM-TO">From Date To Date</option>
                            <option value="SPECIFIC">Specific Date</option>
                        </select>
                        <span className="red">{customDateError}</span>
                    </div>
                    {
                        customDateType === 'SPECIFIC' ?
                        <div className="form-input-container">
                            <label>Specific Date</label>
                            <input 
                            type="date" 
                            className="form-input" 
                            placeholder=""
                            onChange={e => setSpecificDate(e.target.value)}
                            onClick={e => setSpecificDateError()}
                            />
                            <span className="red">{specificDateError}</span>
                        </div>
                        :
                        null
                    }
                    {
                        customDateType === 'UNTIL' ?
                        <div className="form-input-container">
                            <label>Until Date</label>
                            <input 
                            type="date" 
                            className="form-input" 
                            placeholder=""
                            onChange={e => setUntilDate(e.target.value)}
                            onClick={e => setUntilDateError()}
                            />
                            <span className="red">{untilDateError}</span>
                        </div>
                        :
                        null
                    }
                    { customDateType === 'FROM-TO' ? <div></div> : null }
                    {
                        customDateType === 'FROM-TO' ?
                        <div className="form-input-container">
                            <label>From Date</label>
                            <input 
                            type="date" 
                            className="form-input" 
                            placeholder=""
                            onChange={e => setFromDate(e.target.value)}
                            onClick={e => setFromDateError()}
                            />
                            <span className="red">{fromDateError}</span>
                        </div>
                        :
                        null
                    }
                    { customDateType === 'FROM-TO' ? <div></div> : null }
                    {
                        customDateType === 'FROM-TO' ?
                        <div className="form-input-container">
                            <label>To Date</label>
                            <input 
                            type="date" 
                            className="form-input" 
                            placeholder=""
                            onChange={e => setToDate(e.target.value)}
                            onClick={e => setToDateError()}
                            />
                            <span className="red">{toDateError}</span>
                        </div>
                        :
                        null
                    }
                </form>
                <div className="modal-form-btn-container">
                        <div>
                            <button 
                            className="normal-button white-text action-color-bg"
                            onClick={handleSubmit}
                            >
                                submit
                            </button>
                            
                        </div>
                        <div>
                            <button 
                            className="normal-button cancel-button"
                            onClick={e => {
                                e.preventDefault()
                                setShowModalForm(false)
                            }}
                            >Close</button>
                        </div>
                    </div>
            </div>
        </div>
    </div>
}

export default PickDateFormModal