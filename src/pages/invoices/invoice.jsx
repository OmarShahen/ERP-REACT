import { useState, useEffect } from 'react'
import { serverRequest } from "../../components/API/request"
import NavigationBar from '../../components/navigation/navigation-bar';
import { format } from 'date-fns'
import { formatMoney } from '../../utils/numbers'
import './invoice.css'
import { useNavigate } from 'react-router-dom'
import { TailSpin } from 'react-loader-spinner'
import CircularLoading from '../../components/loadings/circular'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PayDebtFormModal from '../../components/modals/pay-debt-form'
import InvoiceDeleteConfirmationModal from '../../components/modals/confirmation/invoice-delete-confirmation-modal';
import EmptySection from '../../components/sections/empty/empty';
import InvoiceFormModal from '../../components/modals/invoice-form';
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined'
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import InvoiceRefundConfirmationModal from '../../components/modals/confirmation/invoice-refund-confirmation-modal';
import { isRolesValid } from '../../utils/roles'
import { useSelector } from 'react-redux'
import translations from '../../i18n'
import { capitalizeFirstLetter } from '../../utils/formatString'


const InvoicePage = ({ roles }) => {

    const formatStatus = (status) => {
        if(status === 'PAID') {
            return <span className="status-btn done">{translations[lang]['Paid']}</span>
        } else if(status === 'PENDING') {
            return <span className="status-btn pending">{translations[lang]['Pending']}</span>
        } else if(status === 'REFUNDED') {
            return <span className="status-btn declined">{translations[lang]['Refunded']}</span>
        } else if(status === 'DRAFT') {
            return <span className="status-btn grey-bg">{translations[lang]['Draft']}</span>
        } else if(status === 'PARTIALLY_PAID') {
            return <span className="tag-purple-bg status-btn white-text">{translations[lang]['Partially Paid']}</span>
        }

        return <span className="status-btn grey-bg">{translations[lang][status.toLowerCase()]}</span>
    }

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const pagePath = window.location.pathname
    const invoiceId = pagePath.split('/')[2]

    const navigate = useNavigate()
    const [invoice, setInvoice] = useState()

    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isShowRefundModal, setIsShowRefundModal] = useState(false)
    const [isShowInvoiceModal, setIsShowInvoiceModal] = useState(false)
    const [reload, setReload] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [isShowDebtForm, setIsShowDebtForm] = useState(false)


    const [insuranceCoverageAmount, setInsuranceCoverageAmount] = useState(0)
    const [insuranceCoveragePercentage, setInsuranceCoveragePercentage] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)
    const [totalAmountRemaining, setTotalAmountRemaining] = useState(0)


    useEffect(() => {
        scroll(0,0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/invoices/${invoiceId}`)
        .then(response => {
            setIsLoading(false)
            setInvoice(response.data.invoice)

            const invoice = response.data.invoice
            setInsuranceCoverageAmount(invoice.totalCost - (invoice.totalCost * (invoice.insuranceCoveragePercentage / 100)))
            setInsuranceCoveragePercentage(invoice?.insuranceCoveragePercentage ? invoice?.insuranceCoveragePercentage / 100 : 1)
            setTotalAmount(invoice.totalCost)
            setTotalAmountRemaining(invoice?.insuranceCoveragePercentage ? invoice.totalCost - (invoice.totalCost * (invoice.insuranceCoveragePercentage / 100)) : 0)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)

            try {

                if(error.response.data.field === 'invoiceId') {
                    setInvoice(null)
                }

            } catch(error) {
                console.error(error)
            }
        })
    }, [reload])

    return <div className="page-container">
        <NavigationBar pageName={translations[lang]['Invoice']} />
        { 
            isShowDeleteModal ? 
            <InvoiceDeleteConfirmationModal 
            invoice={invoice}
            reload={reload}
            setReload={setReload} 
            setIsShowModal={setIsShowDeleteModal}
            /> 
            : 
            null 
        }
        { 
            isShowRefundModal ? 
            <InvoiceRefundConfirmationModal 
            invoice={invoice}
            reload={reload}
            setReload={setReload} 
            setIsShowModal={setIsShowRefundModal}
            /> 
            : 
            null 
        }
        {
            invoice && isShowDebtForm ?
            <PayDebtFormModal 
            invoice={invoice} 
            setReload={setReload} 
            reload={reload}
            setShowFormModal={setIsShowDebtForm} 
            />
            :
            null
        }
        {
            isShowInvoiceModal ?
            <InvoiceFormModal setShowModalForm={setIsShowInvoiceModal}/>
            :
            null
        }

        <div className="padded-container">
            <div className="page-header-wrapper">
            <div className="back-button-container">
                    <ArrowBackIcon />
                    <span onClick={e => navigate(-1)}>{translations[lang]['Back']}</span>
                </div>
                <div className="page-header-container">
                    <div>
                        <h1>
                            {translations[lang]['Invoice']} #{invoice ? invoice.invoiceId : null}
                        </h1>
                    </div>
                    <div className="btns-container subheader-text">
                    </div>
                </div>
            </div>
            {
                invoice && user.roles.includes('STAFF') ?
                <div className="invoice-options-container">
                    <div></div>
                    <div>
                        <button 
                        className="button grey-bg black-text box-shadow-line"
                        onClick={e => setIsShowRefundModal(true)}
                        ><CurrencyExchangeOutlinedIcon />{translations[lang]['Refund']}</button>
                        <button 
                        className="button grey-bg black-text box-shadow-line"
                        onClick={e => setIsShowDebtForm(true)}
                        ><AddCardOutlinedIcon />{translations[lang]['Pay Debt']}</button>
                        <button 
                        className="button grey-bg black-text box-shadow-line"
                        onClick={e => setIsShowDeleteModal(true)}
                        ><DeleteOutlineOutlinedIcon />{translations[lang]['Delete']}</button>
                    </div>
                </div>
                :
                null
            }
            {
                isLoading ?
                <CircularLoading />
                :
                invoice ?
                <div className="cards-grey-container">
                    <div className="invoice-checkout-grid-container body-text">
                        <div className="invoice-services-container">
                            <div className="invoice-header-container">
                                <h6>{translations[lang]['Invoice']} <span className="action-color-text normal-text">#{invoice?.invoiceId}</span></h6>
                                {formatStatus(invoice.status)}
                            </div>
                            <ul>
                                {invoice.invoiceServices.map(service => <li>
                                    <span>{service?.service?.name}</span>
                                    <span className="invoice-price-container">
                                        {formatMoney(service?.service?.cost)}
                                    </span>
                                </li>)}
                            </ul>
                            
                            <ul className="invoice-total-container">
                                <li>
                                    <span className="bold-text">{translations[lang]['Total Amount']}</span>
                                    <span className="bold-text">{formatMoney(invoice.totalCost)}</span>
                                </li>
                                {
                                    invoice?.insuranceCoveragePercentage ?
                                    <li>
                                        <span>{`${translations[lang]['Insurance Coverage']} (${invoice.insuranceCoveragePercentage}%)`}</span>
                                        <span>{formatMoney(totalAmount - insuranceCoverageAmount)}</span>
                                    </li>
                                    :
                                    null
                                }
                                {
                                    invoice?.insuranceCoveragePercentage ?
                                    <li>
                                        <span className="bold-text">{translations[lang]['Receive Amount']}</span>
                                        <span className="bold-text">{formatMoney(totalAmountRemaining)}</span>
                                    </li>
                                    :
                                    null
                                }
                                <li>
                                    <span>{translations[lang]['Amount Paid']}</span>
                                    <span>{formatMoney(invoice.paid)}</span>
                                </li>
                                <li>
                                    <span>{translations[lang]['Amount Remaining']}</span>
                                    <span>{
                                    invoice.insuranceCoveragePercentage ? 
                                    formatMoney(totalAmountRemaining - invoice.paid) 
                                    :
                                    formatMoney(totalAmount - invoice.paid)
                                    }
                                    </span>
                                </li>
                            </ul>
                            <div className="invoice-link-container body-text">
                                <span 
                                className="grey-text"
                                >
                                    {translations[lang]['For any inquiries from patient call']}
                                    <strong className="action-color-text"> +{`${invoice.patient.countryCode}${invoice.patient.phone}`}</strong></span>
                            </div>
                        </div>
                        <div></div>
                        <div className="invoice-payment-container">
                            <div className="invoice-payment-header-container">
                                <span><span className="actions-color-text">{invoice.clinic.name}</span></span>
                                <div>
                                    <strong>{formatMoney(invoice.totalCost)}</strong>
                                </div>
                                {
                                    invoice.dueDate ?
                                    <span>{translations[lang]['Due Date']}, {format(new Date(invoice.dueDate), lang ==='ar' ? 'MM/dd/yyyy' : 'MMM d yyyy')}</span>
                                    :
                                    <span>{translations[lang]['Date']}, {
                                        invoice.invoiceDate ? 
                                        format(new Date(invoice.invoiceDate), lang === 'ar' ? 'MM/dd/yyyy' : 'MMM d yyyy') 
                                        : 
                                        format(new Date(invoice.createdAt), lang === 'ar' ? 'MM/dd/yyyy' : 'MMM d yyyy')
                                        }
                                    </span>
                                }
                            </div>
                            <div className="invoice-payment-list-container">
                                <ul>
                                    {
                                        invoice.creator ?
                                        <li>
                                            <span>{translations[lang]['Creator']}</span>
                                            <input 
                                            className="form-input" 
                                            type="text" 
                                            value={`${invoice?.creator?.firstName} ${invoice?.creator?.lastName}`} 
                                            disabled
                                            />
                                        </li>
                                        :
                                        null
                                    }
                                    <li>
                                        <span>{translations[lang]['To']}</span>
                                        <input 
                                        className="form-input" 
                                        type="text" 
                                        value={`${invoice.patient.firstName} ${invoice.patient.lastName}`} 
                                        disabled
                                        />
                                    </li>
                                    <li>
                                        <span>{translations[lang]['From']}</span>
                                        <input 
                                        className="form-input" 
                                        type="text" 
                                        value={invoice.clinic.name} 
                                        disabled
                                        />
                                    </li>
                                    {
                                        invoice?.insuranceCompany ?
                                        <li>
                                            <span>{translations[lang]['Insurance Company']}</span>
                                            <input 
                                            className="form-input" 
                                            type="text" 
                                            value={invoice?.insuranceCompany?.name}
                                            disabled
                                            />
                                        </li>
                                        :
                                        null
                                    }
                                    <li>
                                        <span>{translations[lang]['Paid']}</span>
                                        <input 
                                        className="form-input" 
                                        type="text" 
                                        value={formatMoney(invoice.paid)}
                                        disabled
                                        />
                                    </li>
                                    <li>
                                        <span>{translations[lang]['Date']}</span>
                                        <input 
                                        className="form-input" 
                                        type="text"
                                        value={ invoice.invoiceDate ? 
                                            format(new Date(invoice.invoiceDate), lang === 'ar' ? 'MM/dd/yyyy' : 'MMM d yyyy') 
                                            : 
                                            format(new Date(invoice.createdAt), lang === 'ar' ? 'MM/dd/yyyy' : 'MMM d yyyy')
                                            }
                                        disabled
                                        />
                                    </li>
                                    {
                                        invoice.dueDate ?
                                        <li>
                                            <span>{translations[lang]['Due Date']}</span>
                                            <input 
                                            className="form-input" 
                                            type="text"
                                            value={format(new Date(invoice.dueDate), 'MMM d yyyy')}
                                            disabled
                                            />
                                        </li>
                                        :
                                        null
                                    }
                                    <li>
                                        <span>{translations[lang]['Payment Method']}</span>
                                        <input 
                                        className="form-input" 
                                        type="text" 
                                        value={invoice.paymentMethod ? translations[lang][capitalizeFirstLetter(invoice.paymentMethod)] : null}
                                        disabled
                                        />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <EmptySection setIsShowForm={setIsShowInvoiceModal} />
            }
            
        </div>
        
    </div>
}

export default InvoicePage