export const searchClinics = (clinic, value) => {

    const currentClinic = clinic
    value = value.toLowerCase()

    const name = currentClinic.name.toLowerCase()
    const phone = `${currentClinic.countryCode}${currentClinic.phone}`
    const city = currentClinic.city.toLowerCase()
    const country = currentClinic.country.toLowerCase()

    if(name.includes(value.toLowerCase())) {
        return true
    } else if(phone.includes(value)) {
        return true
    } else if(city.includes(value)) {
        return true
    } else if(country.includes(value)) {
        return true
    }

    return false
}