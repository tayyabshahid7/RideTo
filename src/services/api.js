import axios from 'axios'
import { refreshToken, getToken, isTokenExpiring } from './auth'

export const TOKEN_REFRESH_URL = 'api/users/refresh/'
export const VERIFY_TOKEN_REQUEST_URL = 'api/users/verify/'
export const POST_METHOD = 'POST'
export const GET_METHOD = 'GET'
export const BASE_URL = process.env.REACT_APP_REST_API_BASE_URL //see .env files

const getCSRFToken = () => {
  const el = document.querySelector('input[name=csrfmiddlewaretoken]')
  return el ? el.value : null
}
const CSRF_TOKEN = getCSRFToken()

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

export const apiGetUnallocatedTests = (schoolId, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    baseURL: BASE_URL
  }
  return axios
    .get(`api/o/${schoolId}/upcoming-tests/`, config)
    .catch(error => error)
}

const request = async (
  method,
  path,
  params,
  data = null,
  auth = true,
  contentType = 'application/json'
) => {
  const existingToken = getToken()
  const token =
    auth && isTokenExpiring(existingToken)
      ? await refreshToken(existingToken)
      : existingToken

  const headers = {
    'Content-Type': contentType
  }
  if (auth) {
    headers.Authorization = `Bearer ${token}`
  }
  if (CSRF_TOKEN) {
    headers['X-CSRFToken'] = CSRF_TOKEN
  }
  const url = `${BASE_URL}api/${path}`

  try {
    const response = await axios({
      method,
      url,
      data,
      headers,
      params
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const getXlsx = async (path, params) => {
  const existingToken = getToken()
  const token = isTokenExpiring(existingToken)
    ? await refreshToken(existingToken)
    : existingToken

  const url = `${BASE_URL}api/${path}`

  try {
    const response = await axios({
      url,
      method: 'get',
      params,
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/xlsx'
      }
    })
    return response.data
  } catch (err) {
    throw err
  }
}

export const get = async (path, params, auth = true) => {
  return await request('get', path, params, null, auth)
}

export const post = async (path, data, auth = true, contentType) => {
  return await request('post', path, {}, data, auth, contentType)
}

export const destroy = async (path, params) => {
  return await request('delete', path, params)
}

export const put = async (path, data, auth = true) => {
  return await request('put', path, {}, data, auth)
}

export const patch = async (path, data) => {
  return await request('patch', path, {}, data)
}

export const parseQueryString = queryString => {
  return queryString.split('&').reduce((data, current) => {
    const bits = current.split('=')
    data[bits[0]] = decodeURIComponent(bits[1])
    return data
  }, {})
}

export const apiHideUnallocatedTest = (schoolId, testId, token) => {
  // const config = {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${token}`
  //   },
  //   params: {
  //     id: testId
  //   },
  //   baseURL: BASE_URL
  // }
  // return axios
  //   .post(`api/o/${schoolId}/upcoming-tests/hide/`, config.params)
  //   .catch(error => error)
  post(`o/${schoolId}/upcoming-tests/hide/`, { id: testId })
}
