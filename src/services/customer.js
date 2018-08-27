import { get } from 'services/api'

export const fetchCustomers = async (params = {}) => {
  const path = `school/customer`
  const response = await get(path, params)

  return response
}
