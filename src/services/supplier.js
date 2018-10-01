import { get } from 'services/api'

export const fetchSuppliers = async (params = {}) => {
  const path = 'school/supplier/'
  const response = await get(path, params)

  return response
}

export const fetchCourseTypeAddons = async (supplierId, courseType) => {
  const path = `suppliers/${supplierId}/addons`
  const response = await get(path, { course_type: courseType }, false)

  return response
}

export const fetchSingleSupplier = async (supplierId, auth = true) => {
  const path = `suppliers/${supplierId}`

  const response = await get(path, {}, auth)

  return response
}
