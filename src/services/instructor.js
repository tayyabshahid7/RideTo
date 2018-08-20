import { get } from 'services/api'

export const fetchInstructors = async schoolId => {
  const path = `school/${schoolId}/instructor`

  const response = await get(path)

  return response
}
