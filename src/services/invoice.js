import { get, post, destroy } from 'services/api'

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

export const deleteInvoice = async id => {
  const path = `school/invoice/${id}`
  const response = await destroy(path)

  return response
}
