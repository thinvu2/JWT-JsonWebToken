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
// khoi tao mot promise cho viec goi API refresh_token
// muc dich tao Promise nay de khi nhan yeu cau refreshToken dau tien thi hold lai viec goi API refresh_token
//cho toi khi xong thi moi _retry lai nhung API
let refreshTokenPromise = null;
// Add a response interceptor
authorizedAxiosInstance.interceptors.response.use((response) => {
    return response
  }, async(error) => {

    const originalRequest = error.config
    console.log('originalRequest', originalRequest)

    if (error.response?.status === 410 && originalRequest) {
    //  originalRequest._retry = true

      if(!refreshTokenPromise) {
        const refreshToken = localStorage.getItem('refreshToken')

        refreshTokenPromise = refreshTokenAPI(refreshToken)
        .then((res) => {
         const { accessToken } = res.data
         localStorage.setItem('accessToken', accessToken)
         authorizedAxiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`
        })
        .catch((_error) => {
       handleLogoutAPI()
       .then(() => {
         location.href = '/login'
       })
       return Promise.reject(_error)
        })
        .finally(() => {
          //du API refresh_token co thanh cong hay loi thi van luon gan lai cai refreshTokenPromise ve null
          refreshTokenPromise = null;
        })
      }
//return cai refreshTokenPromise trong truong hop success o day
      return refreshTokenPromise.then(() => {
        //quan trong return lai axios instance cua chung ta ket hop cai originalRequest de goi lai nhung API ban dau bi loi
        return authorizedAxiosInstance(originalRequest)
      })
    }
    // Redirect to login on 401 error
    if (error.response?.status === 401) {
      console.log("ahihhi 401")

      await handleLogoutAPI()
    // location.href = '/login'
    }
    if (error.response?.status !== 410) {
      toast.error(error.response?.data?.message || error?.message)
    }
    return Promise.reject(error)
  }
)
export default authorizedAxiosInstance
