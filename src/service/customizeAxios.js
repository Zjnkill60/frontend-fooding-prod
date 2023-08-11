import axios from 'axios';


const baseURL = import.meta.env.VITE_URL_BACKEND
const instance = axios.create({
    baseURL: baseURL,
    withCredentials: true,

});

const handleRefreshToken = async () => {
    return await instance.get('auth/refresh')
}
instance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;

instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response && response?.data ? response.data : response
}, async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error?.config && error.response?.status == 401 && error.response?.data?.message == "Unauthorized") {
        let res = await handleRefreshToken()
        console.log('refresh : ', res)
        if (res && res.data) {
            error.config.headers['Authorization'] = `Bearer ${res.data.access_token}`
            localStorage.setItem('access_token', res.data.access_token)
            return axios.request(error.config)
        }
    }

    return error.response?.data ?? Promise.reject(error)
});

export default instance
