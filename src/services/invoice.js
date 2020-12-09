import { get, put, post, destroy } from 'services/api'
import { INVOICE_STATUS_COLOR } from 'common/constants'

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

export const markInvoiceAsPaid = async invoiceId => {
  const path = `school/invoice/${invoiceId}/pay/`
  const data = {
    mark_as_paid: true
  }
  const response = await post(path, data)

  return response
}

export const markInvoiceAsUncollectible = async invoiceId => {
  const path = `school/invoice/${invoiceId}/uncollectible/`
  const response = await post(path)

  return response
}

export const getTagType = tag => {
  return INVOICE_STATUS_COLOR[tag.toLowerCase()] || 'default'
}
