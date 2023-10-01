export const searchPatients = (patient, value) => {

    const currentPatient = patient.patient

    const patientId = `${currentPatient.patientId}`
    const name = `${currentPatient.firstName} ${currentPatient.lastName}`.toLowerCase()
    const phone = `${currentPatient.countryCode}${currentPatient.phone}`
    const cardId = `${currentPatient.cardId}`

    if(patientId.includes(value)) {
        return true
    } else if(name.includes(value.toLowerCase())) {
        return true
    } else if(phone.includes(value)) {
        return true
    } else if(cardId.includes(value)) {
        return true
    }

    return false
}