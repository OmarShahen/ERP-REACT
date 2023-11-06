export const searchLeads = (lead, value) => {

    const name = `${lead.name}`.toLowerCase()
    const phone = `${lead.countryCode}${lead.phone}`

    if(name.includes(value.toLowerCase())) {
        return true
    } else if(phone.includes(value)) {
        return true
    }

    return false
}