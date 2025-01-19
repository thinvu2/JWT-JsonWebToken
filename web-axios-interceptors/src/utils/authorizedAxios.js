import axios from 'axios'
import { toast } from 'react-toastify'
let authorizedAxiosInstance = axios.create()
//max time wating ten 10'
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
authorizedAxiosInstance.defaults.withCredentials = true;
//cau hinh interceptor(bo danh chan vao giua moi request & response)
// Add a request interceptor: can thiep vao giua nhung cai request
authorizedAxiosInstance.interceptors.request.use((config) => {
    // Do something before request is sent
    const accessToken = localStorage.getItem('accessToken')
    if(accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config;
  }, (error) => {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
authorizedAxiosInstance.interceptors.response.use((response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
console.log(error);
if(error.response?.status !== 410) {
    toast.error(error.response?.data?.message || error?.message)
}

    return Promise.reject(error);
  });

export default authorizedAxiosInstance