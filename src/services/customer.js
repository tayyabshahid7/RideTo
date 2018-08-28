import { get } from 'services/api'

export const fetchCustomers = async (params = {}) => {
  const path = `school/customer`
  const response = await get(path, params)

  return response
}

export const fetchCustomer = async (id, params = {}) => {
  const path = `school/customer/${id}`
  const response = await get(path, params)

  return response
}
