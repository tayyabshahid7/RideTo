import axios from 'axios'

// export const LOGIN_REQUEST_URL = 'api/auth/token/'
export const LOGIN_REQUEST_URL = 'api/users/login/'
export const TOKEN_REFRESH_URL = 'api/users/refresh/'
export const VERIFY_TOKEN_REQUEST_URL = 'api/users/verify/'
export const GET_PENDING_ORDERS_URL = 'api/o/pending/'
export const POST_METHOD = 'POST'
export const GET_METHOD = 'GET'
export const BASE_URL = 'http://localhost:8000/' //process.env.REST_API_BASE_URL

export const apiRequest = (url, params = null, data = null, method = GET_METHOD, headers = {}) => {
  const _headers = {
    ...headers,
    'Content-Type': 'application/json',
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


export const apiRequestLogin = (email, password) => {
  const config = {
    headers: {'Content-Type':'application/json'},
    baseURL: BASE_URL,
  }
  const data = {email: email, password: password}
  return axios.post(LOGIN_REQUEST_URL, data, config).catch(error => error)
}

export const apiRequestVerifyToken = (token='invalid') => {
  const config = {
    headers: {'Content-Type':'application/json'},
    baseURL: BASE_URL,
  }
  const data = {token: token}
  return axios.post(VERIFY_TOKEN_REQUEST_URL, data, config).catch(error => error.status)
}


export const apiGetPendingOrders = (schoolId, token) => {
  const config = {
    headers: {
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}`,
    },
    params: {sid: schoolId},
    baseURL: BASE_URL,
  }
  return axios.get(GET_PENDING_ORDERS_URL, config).catch(error => error)
}

// axios.put(this.apiBaseEndpoint + '/' + id, input)
//     .then((response) => {
//         // Success
//     })
//     .catch((error) => {
//         // Error
//         if (error.response) {
//             // The request was made and the server responded with a status code
//             // that falls out of the range of 2xx
//             // console.log(error.response.data);
//             // console.log(error.response.status);
//             // console.log(error.response.headers);
//         } else if (error.request) {
//             // The request was made but no response was received
//             // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
//             // http.ClientRequest in node.js
//             console.log(error.request);
//         } else {
//             // Something happened in setting up the request that triggered an Error
//             console.log('Error', error.message);
//         }
//         console.log(error.config);
//     });