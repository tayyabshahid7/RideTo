import { get, post } from 'services/api'

export const fetchEmails = async customerId => {
  const path = 'email/'
  const params = { customer: customerId }
  const response = await get(path, params)

  return response
}

export const fireEmail = async email => {
  const path = 'email/'
  const params = email

  const response = await post(path, params)

  return response
}
