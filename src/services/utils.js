import {apiRequestVerifyToken } from './api'

export const isAuthenticated = async () => {
    const token = sessionStorage.getItem('token')
    if(token == null) {
      return false
    } else {
      const result = await apiRequestVerifyToken(token)
      return result.status === 200
    }
}

export const decodeJWT =  (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}