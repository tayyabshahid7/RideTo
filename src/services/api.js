import axios from "axios";

// export const LOGIN_REQUEST_URL = 'api/auth/token/'
export const LOGIN_REQUEST_URL = "api/users/login/";
export const TOKEN_REFRESH_URL = "api/users/refresh/";
export const VERIFY_TOKEN_REQUEST_URL = "api/users/verify/";
export const POST_METHOD = "POST";
export const GET_METHOD = "GET";
export const BASE_URL = process.env.REACT_APP_REST_API_BASE_URL; //see .env files

export const apiRequest = (
  url,
  params = null,
  data = null,
  method = GET_METHOD,
  headers = {}
) => {
  const _headers = {
    ...headers,
    "Content-Type": "application/json"
  };
  return axios({
    url,
    headers: _headers,
    paramsSerializer: params => JSON.stringify(params),
    method,
    params,
    data
  });
};

export const apiRequestLogin = (email, password) => {
  const config = {
    headers: { "Content-Type": "application/json" },
    baseURL: BASE_URL
  };
  const data = { email: email, password: password };
  return axios.post(LOGIN_REQUEST_URL, data, config).catch(error => error);
};

export const apiRequestVerifyToken = token => {
  const config = {
    headers: { "Content-Type": "application/json" },
    baseURL: BASE_URL
  };
  const data = { token: token };
  return axios.post(VERIFY_TOKEN_REQUEST_URL, data, config);
};

export const apiGetPendingOrders = (schoolId, page, sorting, token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    params: {
      sort: sorting,
      page: page
    },
    baseURL: BASE_URL
  };
  return axios.get(`api/o/${schoolId}/pending/`, config).catch(error => error);
};

export const apiGetSchoolOrders = (schoolId, page, token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    params: {
      page: page
    },
    baseURL: BASE_URL
  };
  return axios
    .get(`api/o/${schoolId}/confirmed/`, config)
    .catch(error => error);
};

export const apiGet = (
  token = "invalid",
  url = "",
  params = {},
  baseURL = BASE_URL
) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    params: params,
    baseURL: baseURL
  };
  return axios.get(url, config).catch(error => error);
};

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
