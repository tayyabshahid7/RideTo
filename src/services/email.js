import { get, post } from 'services/api'

export const fetchEmails = async (customer, school_id, supplier_id) => {
  const path = 'email/'
  const params = { customer, school_id, supplier_id }
  const response = await get(path, params)

  return response
}

export const fireEmail = async email => {
  const path = 'email/'
  const params = email

  const response = await post(path, params)

  return response
}
