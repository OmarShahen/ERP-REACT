export const capitalizeFirstLetter = str => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const formatPatientName = (patient) => {
  return `${patient?.patient?.firstName} ${patient?.patient?.lastName ? patient?.patient?.lastName : ''}`
}

export const formatBooleanValue = (value) => {

  if(typeof value !== 'boolean') {
      return 'Not Registered'
  } else if(value === true) {
      return 'Yes'
  } else if(value === false) {
      return 'No'
  }
}