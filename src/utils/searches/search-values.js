
export const searchValues = (targetValue, value) => {

    value = value.toLowerCase()

    if(targetValue.value.toLowerCase().includes(value)) {
        return true
    }

    return false
}