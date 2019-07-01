import { get, destroy, post, put } from 'services/api'

export const fetchPromoCodes = async schoolId => {
  const path = `school/${schoolId}/promo-codes`

  const response = await get(path)

  return response
}

export const createPromoCode = async (schoolId, data) => {
  const path = `school/${schoolId}/promo-codes`

  const response = await post(path, data)

  return response
}

export const updatePromoCode = async (schoolId, id, data) => {
  const path = `school/${schoolId}/promo-codes/${id}`

  const response = await put(path, data)

  return response
}

export const deletePromoCode = async (schoolId, id) => {
  const path = `school/${schoolId}/promo-codes/${id}`

  const response = await destroy(path)

  return response
}
