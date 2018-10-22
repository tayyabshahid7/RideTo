import { get } from 'services/api'

export const fetchSearchLocation = async search => {
  const path = 'geolocation'
  const params = { search }
  const authRequired = false

  return await get(path, params, authRequired)
}
