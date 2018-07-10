import {apiRequestVerifyToken } from './api'

export const isAuthenticated = () => {
    const token = sessionStorage.getItem('token')
    if(token == null) {
      return false
    } else {
      const result = apiRequestVerifyToken(token)
      return result.status === 200
    }
}