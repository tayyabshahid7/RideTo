import { get } from 'services/api'

export const fetchSuppliers = async (params = {}) => {
  const path = 'school/supplier/'
  const response = await get(path, params)

  return response
}

export const fetchCourseTypeAddons = async (supplierId, courseTypeId) => {
  const path = `suppliers/${supplierId}/addons`
  const response = await get(path, { courseTypeId }, false)

  return response
}
