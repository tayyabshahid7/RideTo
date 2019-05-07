import { get, post } from 'services/api'

export const fetchCredits = async schoolId => {
  const path = `school/${schoolId}/sms`

  const response = await get(path)

  return response
}

export const purchaseCredits = async (schoolId, data) => {
  const path = `school/${schoolId}/sms`

  const response = await post(path, data)

  return response
}
