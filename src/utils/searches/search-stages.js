
export const searchStages = (stage, value) => {

    value = value.toLowerCase()

    const leadName = `${stage?.lead?.name}`.toLowerCase()

    if(stage.note.toLowerCase().includes(value)) {
        return true
    } else if(leadName.includes(value)) {
        return true
    }

    return false
}