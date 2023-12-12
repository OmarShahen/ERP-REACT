export const getTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone


export const getTime = (dateTimeValue) => {
    return new Date(dateTimeValue).toLocaleTimeString('en', { timeZone: getTimeZone() })
}


export const mergeDateWithTime = (dateValue, timeValue) => {

    const [year, month, day] = dateValue.split('-').map(Number)
    const [hours, minutes] = timeValue.split(':').map(Number)
    const seconds = 0

    const dateTimeValue = new Date(year, month - 1, day, hours, minutes, seconds)

    return dateTimeValue
}

export const WEEK_DAYS = [
    'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'
]