export const searchTreatmentsSurveys = (survey, value) => {

    const clinic = survey.clinic
    const patient = survey.patient
    const member = survey.member

    const treatmentSurveyId = `${survey.treatmentSurveyId}`

    const clinicName = clinic.name.toLowerCase()
    const patientName = `${patient.firstName} ${patient.lastName}`.toLowerCase()
    const patientPhone = `${patient.countryCode}${patient.phone}`
    const memberName = `${member.firstName} ${member.lastName}`.toLowerCase()

    if(treatmentSurveyId.includes(value.toLowerCase())) {
        return true
    } else if(clinicName.includes(value.toLowerCase())) {
        return true
    } else if(patientPhone.includes(value)) {
        return true
    } else if(patientName.includes(value.toLowerCase())) {
        return true
    } else if(memberName.includes(value.toLowerCase())) {
        return true
    }

    return false
}