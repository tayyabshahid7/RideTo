import axios from 'axios'

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
