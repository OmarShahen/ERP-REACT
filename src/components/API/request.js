import axios from 'axios'
import { store } from '../../redux/store'

const DEV_URL = 'http://localhost:5007/api'
const PROD_URL = 'https://us-central1-agile-erp-d452c.cloudfunctions.net/app/api'

export const serverRequest = axios.create({
    baseURL: PROD_URL
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