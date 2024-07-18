import { useState } from 'react'
import './modals.css'
import translations from '../../i18n'
import { useSelector } from 'react-redux'
import CardTransition from '../transitions/card-transitions'


const PickDateFormModal = ({ reload, setReload, setShowModalForm, setStatsQuery, setDatePeriod }) => {

    const lang = useSelector(state => state.lang.lang)

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
        <CardTransition>
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>{translations[lang]['Pick Date']}</h2>
            </div>
            <div className="modal-body-container">
                <form className="modal-form-container responsive-form body-text" onSubmit={handleSubmit}>
                    <div className="form-input-container">
                        <label>{translations[lang]['Custom Date Type']}</label>
                        <select className="form-input" onChange={e => setCustomDateType(e.target.value)}>
                            <option selected disabled>{translations[lang]['Choose Date Type']}</option>
                            <option value="UNTIL">{translations[lang]['Until Date']}</option>
                            <option value="FROM-TO">{translations[lang]['From Date To Date']}</option>
                            <option value="SPECIFIC">{translations[lang]['Specific Date']}</option>
                        </select>
                        <span className="red">{customDateError}</span>
                    </div>
                    {
                        customDateType === 'SPECIFIC' ?
                        <div className="form-input-container">
                            <label>{translations[lang]['Specific Date']}</label>
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
                            <label>{translations[lang]['Until Date']}</label>
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
                            <label>{translations[lang]['From Date']}</label>
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
                            <label>{translations[lang]['To Date']}</label>
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
                                {translations[lang]['Submit']}
                            </button>
                            
                        </div>
                        <div>
                            <button 
                            className="normal-button cancel-button"
                            onClick={e => {
                                e.preventDefault()
                                setShowModalForm(false)
                            }}
                            >{translations[lang]['Close']}</button>
                        </div>
                    </div>
            </div>
        </div>
        </CardTransition>
    </div>
}

export default PickDateFormModal