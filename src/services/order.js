import { get } from 'services/api'

export const fetchSchoolOrders = async (schoolId, params = {}) => {
  const path = `o/${schoolId}/confirmed/`
  const response = await get(path, params)

  return response
}
