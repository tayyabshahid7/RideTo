import { get } from 'services/api'

export const fetchSuppliers = async (params = {}) => {
  const path = 'school/supplier/'
  const response = await get(path, params)

  return response
}
