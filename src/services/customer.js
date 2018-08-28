import { get, post, put } from 'services/api'

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

export const saveCustomer = async customer => {
  const { id } = customer
  const path = id ? `school/customer/${id}` : `school/customer`
  const method = id ? put : post

  return await method(path, customer)
}
