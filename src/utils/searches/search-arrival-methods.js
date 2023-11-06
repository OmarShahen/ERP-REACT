export const searchArrivalMethods = (arrivalMethod, value) => {

    value = value.toLowerCase()

    if(arrivalMethod.name.toLowerCase().includes(value)) {
        return true
    }

    return false
}