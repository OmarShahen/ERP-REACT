
export const searchMessagesTemplates = (messageTemplate, value) => {

    value = value.toLowerCase()

    const messageName = `${messageTemplate?.name}`.toLowerCase()
    const messageDescription = `${messageTemplate?.description}`.toLowerCase()

    if(messageName.includes(value)) {
        return true
    } else if(messageDescription.includes(value)) {
        return true
    }

    return false
}