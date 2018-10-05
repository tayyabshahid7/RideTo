import axios from 'axios'
import { get } from 'services/api'

export const fetchLocationInfoWithPostCode = async postcode => {
  const headers = {
    'Content-Type': 'application/json'
  }
  const url = `https://api.postcodes.io/postcodes/${postcode}`

  try {
    const response = await axios({
      method: 'GET',
      url,
      headers
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const fetchAddressWithPostcode = async params => {
  const path = `postcode`

  const response = await get(path, params, false)

  return response
}
