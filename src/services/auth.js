import {apiRequestVerifyToken } from './api'


const _decodeJWT =  (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}


export const getUserProfile = (token) => {
  return _decodeJWT(token)
}


export const getToken = () => {
  return sessionStorage.getItem('token')
}

export const setToken = (token) => {
  sessionStorage.setItem('token', token)
}

export const removeToken = () => {
  sessionStorage.removeItem('token')
}

const isTokenExpired = (token) => {
    try {
        const decoded = _decodeJWT(token);
        if (decoded.exp < Date.now() / 1000) { // Checking if token is expired.
            return true;
        }
        else
            return false;
    }
    catch (err) {
        return false;
    }
}

export const isAuthenticated = () => {
  const token = getToken()
  return !!token && !isTokenExpired(token)
}


export const isValidToken = async () => {
    const token = getToken()
    if(token == null) {
      return false
    } else {
      const result = await apiRequestVerifyToken(token)
      return result.status === 200
    }
}

