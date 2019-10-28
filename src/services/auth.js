import { post, put } from 'services/api'

const EXPIRE_THRESHOLD = 5 * 60 // seconds

const _decodeJWT = token => {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace('-', '+').replace('_', '/')
  return JSON.parse(window.atob(base64))
}

const setToken = token => {
  window.localStorage.setItem('token', token)
}

const isTokenExpired = token => {
  try {
    const decoded = _decodeJWT(token)
    if (decoded.exp < Date.now() / 1000) {
      window.localStorage.removeItem('token')
      return true
    } else return false
  } catch (err) {
    return false
  }
}

export const getUserProfile = token => {
  return _decodeJWT(token)
}

export const getToken = () => {
  return localStorage.getItem('token')
}

export const verifyToken = async token => {
  const response = await post('users/verify/', { token }, false)
  return response
}

export const removeToken = () => {
  localStorage.removeItem('token')
  window.localStorage.removeItem('username')
}

export const isTokenExpiring = token => {
  if (!token) {
    return false
  }
  const decoded = _decodeJWT(token)
  const timeLeft = decoded.exp - Date.now() / 1000
  return timeLeft > 0 && timeLeft < EXPIRE_THRESHOLD
}

export const requestToken = async (email, password) => {
  const response = await post('users/login/', { email, password }, false)
  setToken(response.token)
  window.localStorage.setItem('username', response.username)
  return response
}

export const refreshToken = async token => {
  const response = await post('users/refresh/', { token }, false)
  setToken(response.token)
  return response.token
}

export const isAuthenticated = () => {
  const token = getToken()
  if (token === null) {
    window.localStorage.removeItem('token')
    return false
  }
  return !isTokenExpired(token)
}

export const updatePassword = async ({ old_password, new_password }) => {
  const response = await put('users/password-reset/', {
    old_password,
    new_password
  })
  return response
}

export const isAdmin = user => {
  if (!user) {
    return false
  }

  const { permission_level } = user
  return permission_level === 'USER_ADMIN'
}
