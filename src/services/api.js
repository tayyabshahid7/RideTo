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

export const apiGetSchoolOrders = (schoolId, page, sorting, token) => {
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

export const get = async (path, params) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    params: params
  }
  const url = `${BASE_URL}api/${path}`

  try {
    const response = await axios.get(url, config)
    return response.data
  } catch (error) {
    // Auth failures dump out of app
    if (error.response.status === 403) {
      window.location.href = '/login'
    }

    return { results: [] }
  }
}

export const post = async (path, data) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    }
  }
  const url = `${BASE_URL}api/${path}`

  try {
    const response = await axios.post(url, data, config)
    return response.data
  } catch (error) {
    // Auth failures dump out of app
    if (error.response.status === 403) {
      window.location.href = '/login'
    }

    return { results: [] }
  }
}

export const destroy = async (path, params) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    params: params
  }
  const url = `${BASE_URL}api/${path}`

  try {
    const response = await axios.delete(url, config)
    return response.data
  } catch (error) {
    // Auth failures dump out of app
    if (error.response.status === 403) {
      window.location.href = '/login'
    }

    return { results: [] }
  }
}

export const put = async (path, data) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    }
  }
  const url = `${BASE_URL}api/${path}`

  try {
    const response = await axios.put(url, data, config)
    return response.data
  } catch (error) {
    // Auth failures dump out of app
    if (error.response.status === 403) {
      window.location.href = '/login'
    }

    return { results: [] }
  }
}

export const patch = async (path, data) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    }
  }
  const url = `${BASE_URL}api/${path}`

  try {
    const response = await axios.patch(url, data, config)
    return response.data
  } catch (error) {
    // Auth failures dump out of app
    if (error.response.status === 403) {
      window.location.href = '/login'
    }

    return { results: [] }
  }
}
