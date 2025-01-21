import axios from 'axios'
import { toast } from 'react-toastify'
import { handleLogoutAPI, refreshTokenAPI } from '~/apis'

let authorizedAxiosInstance = axios.create()
//max time wating ten 10'
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
authorizedAxiosInstance.defaults.withCredentials = true
//cau hinh interceptor(bo danh chan vao giua moi request & response
// Add a request interceptor: can thiep vao giua nhung cai request
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken')

    console.log('Access Token from localStorage:', accessToken);


    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error)
  }
)
// Add a response interceptor

authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    return response
  }, async(error) => {

    const originalRequest = error.config
    console.log('originalRequest', originalRequest)

    if (error.response?.status === 410 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refreshToken')

     return refreshTokenAPI(refreshToken)
     .then((res) => {
      const { accessToken } = res.data
      localStorage.setItem('accessToken', accessToken)
      authorizedAxiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`

      return authorizedAxiosInstance(originalRequest)
     })
     .catch((_error) => {
    handleLogoutAPI()
    .then(() => {
      location.href = '/login'
    })
    return Promise.reject(_error)
     })
        
    }
    // Redirect to login on 401 error
    if (error.response?.status === 401) {
      await handleLogoutAPI()
      console.log(error.response?.status);
      console.log('ahihihhi')
     // location.href = '/login'
    }
    if (error.response?.status !== 410) {
      toast.error(error.response?.data?.message || error?.message)
    }
    return Promise.reject(error)
  }
)
export default authorizedAxiosInstance
