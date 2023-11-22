
export const searchMessagesSent = (messageSent, value) => {

    value = value.toLowerCase()

    const leadName = `${messageSent?.lead?.name}`.toLowerCase()
    const messageTemplateName = `${messageSent?.messageTemplate?.name}`.toLowerCase()

    if(leadName.includes(value)) {
        return true
    } else if(messageTemplateName.includes(value)) {
        return true
    }

    return false
}