import { formatPatientName } from "../formatString"

export const searchComments = (comment, value) => {

    value = value.toLowerCase()

    const patientName = formatPatientName(comment).toLowerCase()
    const clinicName = comment?.clinic?.name.toLowerCase()

    if(comment.description.toLowerCase().includes(value)) {
        return true
    } else if(patientName.includes(value)) {
        return true
    } else if(clinicName.includes(value)) {
        return true
    }

    return false
}