export const searchUsers = (user, value) => {

    const name = `${user.firstName} ${user.lastName}`.toLowerCase()
    const email = user.email
    const gender = user.gender.toLowerCase()

    if(name.includes(value.toLowerCase())) {
        return true
    } else if(email.includes(value.toLowerCase())) {
        return true
    } else if(gender.includes(value.toLowerCase())) {
        return true
    }

    return false
}