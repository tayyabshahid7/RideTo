import { get, post, put, destroy } from 'services/api'

export const fetchInstructors = async schoolId => {
  const path = `school/${schoolId}/instructor`
  const response = await get(path)
  return response
}

export const addInstructor = async (schoolId, instructorData) => {
  const path = `school/${schoolId}/instructor`
  const response = await post(path, instructorData)
  return response
}

export const updateInstructor = async (schoolId, instructorData) => {
  const path = `school/${schoolId}/instructor/${instructorData.id}`
  const response = await put(path, instructorData)
  return response
}

export const removeInstructor = async (schoolId, instructorId) => {
  const path = `school/${schoolId}/instructor/${instructorId}`
  const response = await destroy(path, {})
  return response
}
