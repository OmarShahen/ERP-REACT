import { useState, useEffect } from 'react'
import { serverRequest } from "../../components/API/request"
import { useSelector } from 'react-redux'
import PageHeader from '../../components/sections/page-header'
import NavigationBar from '../../components/navigation/navigation-bar';
import CircularLoading from '../../components/loadings/circular';
import FiltersSection from '../../components/sections/filters/filters'
import FloatingButton from '../../components/buttons/floating-button'
import InvoiceCard from '../../components/cards/invoice'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { searchInvoices } from '../../utils/searches/search-invoices'
import { format } from 'date-fns'
import InvoiceFormModal from '../../components/modals/invoice-form'
import PayDebtFormModal from '../../components/modals/pay-debt-form'
import InvoiceDeleteConfirmationModal from '../../components/modals/confirmation/invoice-delete-confirmation-modal';
import InvoiceRefundConfirmationModal from '../../components/modals/confirmation/invoice-refund-confirmation-modal';
import { isRolesValid } from '../../utils/roles';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { formatNumber, formatMoney } from '../../utils/numbers'
import Card from '../../components/cards/card'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import translations from '../../i18n'
import SelectSection from '../../components/sections/selectors/select';

const InvoicesPage = ({ roles }) => {

    const navigate = useNavigate()

    const [isShowForm, setIsShowForm] = useState(false)
    const [isShowPayDebtForm, setIsShowPayDebtForm] = useState(false)
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isShowRefundModal, setIsShowRefundModal] = useState(false)

    const [targetInvoice, setTargetInvoice] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [isSelectMode, setIsSelectMode] = useState(false)
    const [reload, setReload] = useState(1)
    const [showModalForm, setShowModalForm] = useState(false)
    const [invoices, setInvoices] = useState([])
    const [selectedInvoices, setSelectedInvoices] = useState([])
    const [searchedInvoices, setSearchedInvoices] = useState([])
    const [viewStatus, setViewStatus] = useState('ALL')
    
    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const activeElementColor = { border: '2px solid #4c83ee', color: '#4c83ee' }

    const todayDate = new Date()

    const [statsQuery, setStatsQuery] = useState({ specific: format(todayDate, 'yyyy-MM-dd') })

    useEffect(() => { 
        //scroll(0,0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {

        let endpointURL = ''

        if(user.roles.includes('STAFF')) {
            endpointURL = `/v1/invoices/clinics/${user.clinicId}`
        } else {
            endpointURL = `/v1/invoices/owners/${user._id}`
        }

        setIsLoading(true)
        serverRequest.get(endpointURL, { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            setInvoices(response.data.invoices)
            setSearchedInvoices(response.data.invoices)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload, statsQuery])

    const getTotalInvoicesCost = (invoices) => {

        let total = 0

        for(let i=0;i<invoices.length;i++) {
            total += invoices[i].totalCost
        }

        return total
    }

    const getTotalPaid = (invoices) => {

        let total = 0

        for(let i=0;i<invoices.length;i++) {
            const invoice = invoices[i]
            if(invoice.insuranceCoveragePercentage) {
                total += (invoice.totalCost * (invoice.insuranceCoveragePercentage / 100)) + invoice.paid
                continue
            }

            total += invoices[i].paid
        }

        return total
    }

    const getTotalRemaining = (invoices) => {

        let total = 0

        for(let i=0;i<invoices.length;i++) {
            const invoice = invoices[i]
            if(invoice.insuranceCoveragePercentage) {
                total +=  (invoice.totalCost - (invoice.totalCost * (invoice.insuranceCoveragePercentage / 100)) - invoice.paid)
                continue
            }
            total += (invoice.totalCost - invoice.paid)
        }

        return total
    }


    return <div className="page-container">
        <NavigationBar pageName={translations[lang]['Invoices']} />
        { 
        isShowDeleteModal ? 
        <InvoiceDeleteConfirmationModal 
        invoice={targetInvoice}
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
        invoice={targetInvoice}
        reload={reload}
        setReload={setReload} 
        setIsShowModal={setIsShowRefundModal}
        /> 
        : 
        null 
        }

        { isShowForm ? <InvoiceFormModal setShowModalForm={setIsShowForm} /> : null }
        { 
            isShowPayDebtForm ? 
            <PayDebtFormModal 
            invoice={targetInvoice} 
            reload={reload} 
            setReload={setReload} 
            setShowFormModal={setIsShowPayDebtForm}
            /> 
            : 
            null 
        }
        {
            user.roles.includes('STAFF') ?
            <div className="show-mobile">
                <FloatingButton setIsShowForm={setIsShowForm} />
            </div>
            :
            null
        }
        
        <div className="padded-container">
            <PageHeader 
            pageName={translations[lang]["Invoices"]} 
            setReload={setReload}
            reload={reload}
            /> 
            <div className="cards-4-list-wrapper">
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={translations[lang]['Total Invoices']}
                number={formatNumber(invoices.length)}
                iconColor={'#5C60F5'}
                />
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={translations[lang]['Full Paid Invoices']}
                number={formatNumber(invoices.filter(invoice => ['PAID'].includes(invoice.status)).length)}
                iconColor={'#FF8C00'}
                />
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={translations[lang]['Partially Paid Invoices']}
                number={formatNumber(invoices.filter(invoice => invoice.status === 'PARTIALLY_PAID').length)}
                iconColor={'#5C60F5'}
                />
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={translations[lang]['Refunded Invoices']}
                number={formatNumber(invoices.filter(appointment => appointment.status === 'REFUNDED').length)}
                iconColor={'#FF579A'}
                />
                <Card 
                icon={<PaidOutlinedIcon />}
                cardHeader={translations[lang]['Total Expected']}
                number={formatMoney(getTotalInvoicesCost(invoices.filter(invoice => invoice.status !== 'REFUNDED')))}
                iconColor={'#5C60F5'}
                />
                <Card 
                icon={<PaidOutlinedIcon />}
                cardHeader={translations[lang]['Total Paid']}
                number={formatMoney(getTotalPaid(invoices.filter(invoice => ['PAID', 'PARTIALLY_PAID'].includes(invoice.status))))}
                iconColor={'#FF8C00'}
                />
                <Card 
                icon={<PaidOutlinedIcon />}
                cardHeader={translations[lang]['Total Remaining']}
                number={formatMoney(getTotalRemaining(invoices.filter(invoice => invoice.status === 'PARTIALLY_PAID')))}
                iconColor={'#5C60F5'}
                />
                {/*<Card 
                icon={<PaidOutlinedIcon />}
                cardHeader={translations[lang]['Total Refunded']}
                number={formatMoney(getTotalPaid(invoices.filter(appointment => appointment.status === 'REFUNDED')))}
                iconColor={'#FF579A'}
                />*/}
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={translations[lang]['Overdue Invoices']}
                number={formatNumber(invoices.filter(invoice => new Date(invoice.dueDate) < new Date() && !['PAID', 'REFUNDED'].includes(invoice.status)).length)}
                iconColor={'#00D4FF'}
                />
            </div>
            <br />
            <FiltersSection 
            statsQuery={statsQuery} 
            setStatsQuery={setStatsQuery} 
            isShowUpcomingDates={false}
            defaultValue={'0'}
            />
            <div className="search-input-container">
                <SearchInput 
                rows={invoices} 
                setRows={setSearchedInvoices}
                searchRows={searchInvoices}
                isHideClinics={user.roles.includes('STAFF') ? true : false}
                isShowInsuranceCompanies={user.roles.includes('STAFF') || user.roles.includes('OWNER') ? true : false}
                isShowItemSelection={true}
                setSelectedItems={setSelectedInvoices}
                selectedItems={selectedInvoices}
                />
            </div>
            <div className="appointments-categories-container">
                    <div style={ viewStatus === 'ALL' ? activeElementColor : null } onClick={e => {
                        setViewStatus('ALL')
                        setSearchedInvoices(invoices.filter(invoice => true))
                    }}>
                        {translations[lang]['All']}
                    </div>
                    <div style={ viewStatus === 'DRAFT' ?  activeElementColor : null } onClick={e => {
                        setViewStatus('DRAFT')
                        setSearchedInvoices(invoices.filter(invoice => invoice.status === 'DRAFT'))
                    }}>
                        {translations[lang]['Draft']}
                    </div>
                    <div style={ viewStatus === 'PENDING' ?  activeElementColor : null } onClick={e => {
                        setViewStatus('PENDING')
                        setSearchedInvoices(invoices.filter(invoice => invoice.status === 'PENDING'))
                    }}>
                        {translations[lang]['Pending']}
                    </div>
                    <div style={ viewStatus === 'PAID' ? activeElementColor : null } onClick={e => {
                        setViewStatus('PAID')
                        setSearchedInvoices(invoices.filter(invoice => invoice.status === 'PAID'))
                    }}>
                        {translations[lang]['Paid']}
                    </div>
                    <div style={ viewStatus === 'PARTIALLY-PAID' ? activeElementColor : null } onClick={e => {
                        setViewStatus('PARTIALLY-PAID')
                        setSearchedInvoices(invoices.filter(invoice => invoice.status === 'PARTIALLY_PAID'))
                    }}>
                        {translations[lang]['Partially Paid']}
                    </div>
                    <div style={ viewStatus === 'OVERDUE' ? activeElementColor : null } onClick={e => {
                        setViewStatus('OVERDUE')
                        setSearchedInvoices(invoices.filter(invoice => new Date(invoice.dueDate) < new Date() && !['PAID', 'REFUNDED'].includes(invoice.status)))
                    }}>
                        {translations[lang]['Overdue']}
                    </div>
                    <div style={ viewStatus === 'REFUNDED' ? activeElementColor : null } onClick={e => {
                        setViewStatus('REFUNDED')
                        setSearchedInvoices(invoices.filter(invoice => invoice.status === 'REFUNDED'))
                    }}>
                        {translations[lang]['Refunded']}
                    </div>
            </div>
            
            {
                isLoading ?
                <CircularLoading />
                :
                searchedInvoices.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                        {searchedInvoices.map(invoice => <InvoiceCard 
                        invoice={invoice} 
                        reload={reload} 
                        setReload={setReload} 
                        setTargetInvoice={setTargetInvoice}
                        setIsShowPayDebtForm={setIsShowPayDebtForm}
                        setIsShowDeleteModal={setIsShowDeleteModal}
                        setIsShowRefundModal={setIsShowRefundModal}
                        setSelectedInvoices={setSelectedInvoices}
                        selectedInvoices={selectedInvoices}
                        isSelectMode={isSelectMode}
                        />)}                    
                </div>
                :
                <EmptySection setIsShowForm={setIsShowForm} />
            }
        </div>
        
    </div>
}

export default InvoicesPage