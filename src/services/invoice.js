import { get, post } from 'services/api'

export const sendInvoice = async data => {
  const path = 'school/invoice/'
  const response = await post(path, data)

  return response
}

export const fetchInvoices = async (params = {}) => {
  const path = 'school/invoice/'
  const response = await get(path, params)

  return response
}
