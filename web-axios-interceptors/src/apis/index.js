import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

export const handleLogoutAPI = async () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userInfo')

    //cookies => dung http only cookie goi api de xu ly remove cookie
    return await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
    //setUser(null)
}
export const refreshTokenAPI = async(refreshToken) => {
    return await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/refresh_token`, { refreshToken })
}