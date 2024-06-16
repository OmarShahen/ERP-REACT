import { useState, useEffect } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { axlesOptions, cabinOptions, citiesOptions, conditionOptions, suspensionOptions } from '../../utils/values'
import { formatNumber } from '../../utils/numbers'
import { format } from 'date-fns'
import { formatBooleanAndString, formatBooleanValue, formatStringToBoolean } from '../../utils/formatString'


const ItemFormModal = ({ reload, setReload, setShowModalForm, isUpdate, setIsUpdate, item }) => {

    const pagePath = window.location.pathname
    const ownerId = pagePath.split('/')[3]

    const [isSubmit, setIsSubmit] = useState(false)

    const [categories, setCategories] = useState([])
    const [subCategories, setSubcategories] = useState([])
    const [brands, setBrands] = useState([])

    const [categoryId, setCategoryId] = useState(isUpdate ? item.categoryId : '')
    const [subcategoryId, setSubcategoryId] = useState(isUpdate ? item.subcategoryId : '')
    const [brandId, setBrandId] = useState(isUpdate ? item.brandId : '')
    const [city, setCity] = useState(isUpdate ? item.city : '')
    const [rentingPrice, setRentingPrice] = useState(isUpdate ? item.rentingPrice : '')
    const [sellingPrice, setSellingPrice] = useState(isUpdate ? item.sellingPrice : '')
    const [manufactureYear, setManufactureYear] = useState(isUpdate ? format(new Date(item.manufactureYear), 'yyyy-MM-dd') : null)
    const [mileage, setMileage] = useState(isUpdate ? item.mileage : '')
    const [condition, setCondition] = useState(isUpdate ? item.condition : undefined)
    const [runningHours, setRunningHours] = useState(isUpdate ? item.runningHours : '')
    const [enginePower, setEnginePower] = useState(isUpdate ? item.enginePower : '')
    const [cabin, setCabin] = useState(isUpdate ? item.cabin : undefined)
    const [suspension, setSuspension] = useState(isUpdate ? item.suspension : undefined)
    const [axles, setAxles] = useState(isUpdate ? item.axles : undefined)
    const [isForRenting, setIsForRenting] = useState(isUpdate ? formatBooleanValue(item.isForRenting).toUpperCase() : 'NO')
    const [isForSelling, setIsForSelling] = useState(isUpdate ? formatBooleanValue(item.isForSelling).toUpperCase() : 'NO')

    const [categoryIdError, setCategoryIdError] = useState()
    const [subcategoryIdError, setSubcategoryIdError] = useState()
    const [brandIdError, setBrandIdError] = useState()
    const [cityError, setCityError] = useState()
    const [rentingPriceError, setRentingPriceError] = useState()
    const [sellingPriceError, setSellingPriceError] = useState()
    const [manufactureYearError, setManufactureYearError] = useState()
    const [mileageError, setMileageError] = useState()
    const [conditionError, setConditionError] = useState()
    const [runningHoursError, setRunningHoursError] = useState()
    const [enginePowerError, setEnginePowerError] = useState()
    const [cabinError, setCabinError] = useState()
    const [suspensionError, setSuspensionError] = useState()
    const [axlesError, setAxlesError] = useState()
    const [isForRentingError, setIsForRentingError] = useState()
    const [isForSellingError, setIsForSellingError] = useState()

    const booleanOptions = [
        { name: 'Yes', value: 'YES' },
        { name: 'No', value: 'NO' }
    ]

    useEffect(() => {
        serverRequest.get(`/v1/specialities`)
        .then(response => {
            setCategories(response.data.specialities)
        })
        .catch(error => {
            console.error(error)
        })
    }, [])

    useEffect(() => {
        if(!categoryId) {
            return
        }
        serverRequest.get(`/v1/specialities/${categoryId}/sub-specialities`)
        .then(response => {
            setSubcategories(response.data.specialities)
        })
        .catch(error => {
            console.error(error)
        })
    }, [categoryId])

    useEffect(() => {
        if(!categoryId) {
            return
        }
        serverRequest.get(`/v1/brands/categories/${categoryId}`)
        .then(response => {
            setBrands(response.data.brands)
        })
        .catch(error => {
            console.error(error)
        })
    }, [categoryId])

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!categoryId) return setCategoryIdError('Category is required')

        if(!subcategoryId) return setSubcategoryIdError('Subcategory is required')

        if(!brandId) return setBrandIdError('Brand is required')

        const itemData = {
            ownerId,
            categoryId,
            subcategoryId,
            brandId,
            city,
            manufactureYear,
            mileage: Number.parseInt(mileage),
            enginePower: Number.parseInt(enginePower),
            runningHours: Number.parseInt(runningHours),
            condition,
            cabin,
            suspension,
            axles: Number.parseInt(axles),
            isForSelling: formatStringToBoolean(isForSelling),
            isForRenting: formatStringToBoolean(isForRenting),
            sellingPrice: Number.parseInt(sellingPrice),
            rentingPrice: Number.parseInt(rentingPrice)
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/items`, itemData)
        .then(response => {
            setIsSubmit(false)
            setReload(reload + 1)
            setShowModalForm(false)
            toast.success(response.data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            
            try {
                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }

    const handleUpdate = (e) => {
        e.preventDefault()

        if(!categoryId) return setCategoryIdError('Category is required')

        if(!subcategoryId) return setSubcategoryIdError('Subcategory is required')

        if(!brandId) return setBrandIdError('Brand is required')

        const itemData = {
            categoryId,
            subcategoryId,
            brandId,
            city,
            manufactureYear,
            mileage: Number.parseInt(mileage),
            enginePower: Number.parseInt(enginePower),
            runningHours: Number.parseInt(runningHours),
            condition,
            cabin,
            suspension,
            axles: Number.parseInt(axles),
            isForSelling: formatStringToBoolean(isForSelling),
            isForRenting: formatStringToBoolean(isForRenting),
            sellingPrice: Number.parseInt(sellingPrice),
            rentingPrice: Number.parseInt(rentingPrice)
        }

        setIsSubmit(true)
        serverRequest.put(`/v1/items/${item._id}`, itemData)
        .then(response => {
            setIsSubmit(false)
            setReload(reload + 1)
            setShowModalForm(false)
            toast.success(response.data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            
            try {
                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }

    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>{ isUpdate ? `Update Item #${item.itemId}` : 'Add Item'}</h2>
            </div>
            <div className="modal-body-container">
                <form 
                id="patient-form" 
                className="modal-form-container responsive-form body-text" 
                onSubmit={isUpdate ? handleUpdate : handleSubmit}
                >
                    <div className="form-input-container">
                        <label>Category</label>
                        <select
                        className="form-select"
                        onChange={e => setCategoryId(e.target.value)}
                        onClick={() => setCategoryIdError()}
                        >
                            <option selected disabled>Select Category</option>
                            {categories.map(category => {
                                if(category._id === categoryId) {
                                    return <option selected value={category._id}>
                                    {category.name}
                                </option>
                                }
                                return <option value={category._id}>
                                    {category.name}
                                </option>
                            })}
                        </select>
                        <span className="red">{categoryIdError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Subcategory</label>
                        <select
                        className="form-select"
                        onChange={e => setSubcategoryId(e.target.value)}
                        onClick={() => setSubcategoryIdError()}
                        >
                            <option selected disabled>Select Subcategory</option>
                            {subCategories.map(category => {
                                if(category._id === subcategoryId) {
                                    return <option selected value={category._id}>
                                    {category.name}
                                </option>
                                }
                                return <option value={category._id}>
                                    {category.name}
                                </option>
                            })}
                        </select>
                        <span className="red">{subcategoryIdError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Brand</label>
                        <select
                        className="form-select"
                        onChange={e => setBrandId(e.target.value)}
                        onClick={() => setBrandIdError()}
                        >
                            <option selected disabled>Select Brand</option>
                            {brands.map(brand => {
                                if(brand._id === brandId) {
                                    return <option selected value={brand._id}>
                                            {brand.name}
                                        </option>
                                }
                                return <option value={brand._id}>
                                    {brand.name}
                                </option>
                            })}
                        </select>
                        <span className="red">{brandIdError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>City</label>
                        <select
                        className="form-select"
                        onChange={e => setCity(e.target.value)}
                        onClick={() => setCityError()}
                        >
                            <option selected disabled>Select City</option>
                            {citiesOptions.map(tempCity => {
                                if(tempCity.value === city) {
                                    return <option selected value={tempCity.value}>
                                        {tempCity.name}
                                    </option>
                                }
                                return <option value={tempCity.value}>
                                    {tempCity.name}
                                </option>
                            })}
                        </select>
                        <span className="red">{cityError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Manufacture Year</label>
                        <input
                        type="date"
                        className="form-input"
                        onChange={e => setManufactureYear(e.target.value)}
                        onClick={() => setManufactureYearError()}
                        value={manufactureYear}
                        />
                        <span className="red">{manufactureYearError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Mileage (KM)</label>
                        <input
                        type="number"
                        className="form-input"
                        onChange={e => setMileage(e.target.value)}
                        onClick={() => setMileageError()}
                        value={mileage}
                        />
                        <span className="red">{mileageError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Engine Power (KW)</label>
                        <input
                        type="number"
                        className="form-input"
                        onChange={e => setEnginePower(e.target.value)}
                        onClick={() => setEnginePowerError()}
                        value={enginePower}
                        />
                        <span className="red">{enginePowerError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Running Hours (M/H)</label>
                        <input
                        type="number"
                        className="form-input"
                        onChange={e => setRunningHours(e.target.value)}
                        onClick={() => setRunningHoursError()}
                        value={runningHours}
                        />
                        <span className="red">{runningHoursError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Condition</label>
                        <select
                        className="form-select"
                        onChange={e => setCondition(e.target.value)}
                        onClick={() => setConditionError()}
                        >
                            <option selected disabled>Select Condition</option>
                            {conditionOptions.map(option => {
                                if(option.value === condition) {
                                    return <option selected value={option.value}>
                                    {option.name}
                                </option> 
                                }
                                return <option value={option.value}>
                                    {option.name}
                                </option>
                            })}
                        </select>
                        <span className="red">{conditionError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Cabin</label>
                        <select
                        className="form-select"
                        onChange={e => setCabin(e.target.value)}
                        onClick={() => setCabinError()}
                        >
                            <option selected disabled>Select Cabin</option>
                            {cabinOptions.map(option => {
                                if(option.value === cabin) {
                                    return <option selected value={option.value}>
                                    {option.name}
                                </option> 
                                }
                                return <option value={option.value}>
                                    {option.name}
                                </option>
                            })}
                        </select>
                        <span className="red">{cabinError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Suspension</label>
                        <select
                        className="form-select"
                        onChange={e => setSuspension(e.target.value)}
                        onClick={() => setSuspensionError()}
                        >
                            <option selected disabled>Select Suspension</option>
                            {suspensionOptions.map(option => {
                                if(option.value === suspension) {
                                    return <option selected value={option.value}>
                                    {option.name}
                                </option> 
                                }
                                return <option value={option.value}>
                                    {option.name}
                                </option>
                            })}
                        </select>
                        <span className="red">{suspensionError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Axles</label>
                        <select
                        className="form-select"
                        onChange={e => setAxles(e.target.value)}
                        onClick={() => setAxlesError()}
                        >
                            <option selected disabled>Select Axles</option>
                            {axlesOptions.map((option, index) => {
                                if(option.value === axles) {
                                    return <option selected value={option.value}>
                                    {option.name}
                                </option> 
                                }
                                if(index === 0) {
                                    return <option value={option.value}>
                                    {option.name} axle
                                </option>
                                }
                                return <option value={option.value}>
                                    {option.name} axles
                                </option>
                            })}
                        </select>
                        <span className="red">{axlesError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>For Selling</label>
                        <select
                        className="form-select"
                        onChange={e => setIsForSelling(e.target.value)}
                        onClick={() => setIsForSellingError()}
                        >
                            {booleanOptions.map((option) => {
                                if(option.value === isForSelling) {
                                    return <option selected value={option.value}>
                                    {option.name}
                                </option>
                                }
                                return <option value={option.value}>
                                    {option.name}
                                </option>
                            })}
                        </select>
                        <span className="red">{isForSellingError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>For Renting</label>
                        <select
                        className="form-select"
                        onChange={e => setIsForRenting(e.target.value)}
                        onClick={() => setIsForRentingError()}
                        >
                            {booleanOptions.map((option) => {
                                if(option.value === isForRenting) {
                                    return <option selected value={option.value}>
                                    {option.name}
                                </option>
                                }
                                return <option value={option.value}>
                                    {option.name}
                                </option>
                            })}
                        </select>
                        <span className="red">{isForRentingError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Selling Price {sellingPrice ? formatNumber(sellingPrice) : null} EGP</label>
                        <input
                        type="number"
                        className="form-input"
                        onChange={e => setSellingPrice(e.target.value)}
                        onClick={() => setSellingPriceError()}
                        value={sellingPrice}
                        />
                        <span className="red">{sellingPriceError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Renting Price {rentingPrice ? formatNumber(rentingPrice) : null} EGP per day</label>
                        <input
                        type="number"
                        className="form-input"
                        onChange={e => setRentingPrice(e.target.value)}
                        onClick={() => setRentingPriceError()}
                        value={rentingPrice}
                        />
                        <span className="red">{rentingPriceError}</span>
                    </div>
                </form>
            </div>
            <div className="modal-form-btn-container">
                <div>
                    {
                        isSubmit ?
                        <TailSpin width="25" height="25" color="#4c83ee" />
                        :
                        <button 
                        form="patient-form"
                        className="normal-button white-text action-color-bg"
                        >{isUpdate ? 'Update' : 'Create'}</button>
                    }
                </div>
                <div>
                    <button 
                    className="normal-button cancel-button"
                    onClick={e => {
                        setShowModalForm(false)
                        setIsUpdate(false)
                    }}
                    >Close</button>
                </div>
            </div>
        </div>
    </div>
}


export default ItemFormModal