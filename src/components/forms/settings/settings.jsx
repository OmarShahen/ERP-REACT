import { useState } from 'react'
import { serverRequest } from '../../API/request'
import { TailSpin } from 'react-loader-spinner'
import { toast } from 'react-hot-toast'

const SettingsForm = (props) => {

    const [notificationEmail, setNotificationEmail] = useState(props.settings?.notificationEmail)
    const [paymentCommission, setPaymentCommission] = useState(props.settings?.paymentCommission)
    const [currencyPriceUSD, setCurrencyPriceUSD] = useState(props.settings?.currencyPriceUSD)
    const [supportNumber, setSupportNumber] = useState(props.settings?.supportNumber)

    const [notificationEmailError, setNotificationEmailError] = useState()
    const [paymentCommissionError, setPaymentCommissionError] = useState()
    const [currencyPriceUSDError, setCurrencyPriceUSDError] = useState()
    const [supportNumberError, setSupportNumberError] = useState()

    const [isSubmit, setIsSubmit] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!notificationEmail) return setNotificationEmailError('Notification email is required')

        if(!paymentCommission) return setPaymentCommissionError('Payment commission is required')

        if(!currencyPriceUSD) return setCurrencyPriceUSDError('Currency price in USD is required')

        if(!supportNumber) return setSupportNumberError('Support number is required')

        const settingsData = {
            notificationEmail: notificationEmail.toLowerCase().trim(),
            paymentCommission: Number.parseFloat(paymentCommission),
            currencyPriceUSD: Number.parseFloat(currencyPriceUSD),
            supportNumber
        }

        setIsSubmit(true)
        serverRequest.put('/v1/settings', settingsData)
        .then(response => {
            setIsSubmit(false)
            props.setReload(props.reload + 1)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
        
    }


    return <div>
    <div className="cards-2-list-wrapper">
        <div>
            <div className="form-input-container">
                <label>Notification Email</label>
                <input 
                type="email"
                className="form-input"
                value={notificationEmail}
                onClick={() => setNotificationEmailError()}
                onChange={e => setNotificationEmail(e.target.value)}
                />
                <span className="red">{notificationEmailError}</span>
            </div>
            <br />
            <div className="form-input-container">
                <label>Payment Commission</label>
                <input 
                type="number"
                className="form-input"
                value={paymentCommission}
                onClick={() => setPaymentCommissionError()}
                onChange={e => setPaymentCommission(e.target.value)}
                />
                <span className="red">{paymentCommissionError}</span>
            </div>
            <br />
            <div className="form-input-container">
                <label>USD Price in EGP</label>
                <input 
                type="number"
                className="form-input"
                value={currencyPriceUSD}
                onClick={() => setCurrencyPriceUSDError()}
                onChange={e => setCurrencyPriceUSD(e.target.value)}
                />
                <span className="red">{currencyPriceUSDError}</span>
            </div>
            <br />
            <div className="form-input-container">
                <label>Support Number</label>
                <input 
                type="text"
                className="form-input"
                value={supportNumber}
                onClick={() => setSupportNumberError()}
                onChange={e => setSupportNumber(e.target.value)}
                />
                <span className="red">{supportNumberError}</span>
            </div>
        </div>
    </div>
    <br />
    <div>
        {
            isSubmit ?
            <TailSpin
            height="25"
            width="25"
            color="#4c83ee"
            />
        :
            <button onClick={handleSubmit} className="button">
                Update
            </button>
        }
    </div>
    </div>
}

export default SettingsForm