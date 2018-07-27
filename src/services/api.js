import axios from 'axios'
import { getToken } from './auth'

export const LOGIN_REQUEST_URL = 'api/users/login/'
export const TOKEN_REFRESH_URL = 'api/users/refresh/'
export const VERIFY_TOKEN_REQUEST_URL = 'api/users/verify/'
export const POST_METHOD = 'POST'
export const GET_METHOD = 'GET'
export const BASE_URL = process.env.REACT_APP_REST_API_BASE_URL //see .env files

export const apiRequest = (
  url,
  params = null,
  data = null,
  method = GET_METHOD,
  headers = {}
) => {
  const _headers = {
    ...headers,
    'Content-Type': 'application/json'
  }
  return axios({
    url,
    headers: _headers,
    paramsSerializer: params => JSON.stringify(params),
    method,
    params,
    data
  })
}

function headerForRequest(headers = {}) {
  const _headers = {
    ...headers,
    'Content-Type': 'application/json'
  }
  let token = getToken()
  if (token) {
    _headers['Authorization'] = `Bearer ${token}`
  }
  return _headers
}

async function sendGetRequest(relativeUrl, headers = {}) {
  const url = `${BASE_URL}${relativeUrl}`
  return axios({
    method: 'GET',
    url,
    headers: headerForRequest(headers)
  })
}

async function sendPostRequest(relativeUrl, formData, headers = {}) {
  const url = `${BASE_URL}${relativeUrl}`
  return axios({
    method: 'POST',
    url,
    headers: headerForRequest(headers),
    data: formData
  })
}

export const apiRequestLogin = (email, password) => {
  const config = {
    headers: { 'Content-Type': 'application/json' },
    baseURL: BASE_URL
  }
  const data = { email: email, password: password }
  return axios.post(LOGIN_REQUEST_URL, data, config).catch(error => error)
}

export const apiRequestVerifyToken = token => {
  const config = {
    headers: { 'Content-Type': 'application/json' },
    baseURL: BASE_URL
  }
  const data = { token: token }
  return axios.post(VERIFY_TOKEN_REQUEST_URL, data, config)
}

export const apiGetPendingOrders = (schoolId, page, sorting, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    params: {
      sort: sorting,
      page: page
    },
    baseURL: BASE_URL
  }
  return axios.get(`api/o/${schoolId}/pending/`, config).catch(error => error)
}

export const apiGetSchoolOrders = (schoolId, page, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    params: {
      page: page
    },
    baseURL: BASE_URL
  }
  return axios.get(`api/o/${schoolId}/confirmed/`, config).catch(error => error)
}

export const apiGet = (
  token = 'invalid',
  url = '',
  params = {},
  baseURL = BASE_URL
) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    params: params,
    baseURL: baseURL
  }
  return axios.get(url, config).catch(error => error)
}

export const getCourses = () => {
  const url = `/api/calendar/`
  sendPostRequest(url, {})
}
