import { get } from 'services/api'

export const fetchAddressWithPostcode = async params => {
  const path = `postcode`

  const response = await get(path, params, false)

  return response
}
