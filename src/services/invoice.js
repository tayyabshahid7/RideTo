import { get, put, post, destroy } from 'services/api'

export const sendInvoice = async data => {
  const path = 'school/invoice/'
  const response = await post(path, data)

  return response
}

export const updateInvoice = async (id, data) => {
  const path = `school/invoice/${id}`
  const response = await put(path, data)

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

export const deleteInvoiceLine = async (invoiceId, lineId) => {
  const path = `school/invoice/${invoiceId}/${lineId}/`
  const response = await destroy(path)

  return response
}

export const addInvoiceLine = async (invoiceId, data) => {
  const path = `school/invoice/${invoiceId}/add-item/`
  const response = await post(path, data)

  return response
}
