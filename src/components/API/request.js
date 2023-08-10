import axios from 'axios'
import { store } from '../../redux/store'

const DEV_URL = 'http://localhost:5000/api'
const PROD_URL = 'https://barbells-eg.co/api'

export const serverRequest = axios.create({
    baseURL: DEV_URL
})

serverRequest.interceptors.request.use(config => {

    const { user } = store.getState()?.user
    const { lang } = store.getState()?.lang

    if(!user) {
        return config
    }

    config.headers['x-access-token'] = user.accessToken

    config.params = { ...config.params, lang: lang }

    return config

}, 
error => {
    console.log('error in request interceptor', error)
    return Promise.reject(error)
}
)