import { get, post, put, destroy } from 'services/api'

export const fetchInstructors = async () => {
  const path = `school/instructor`
  const response = await get(path)
  return response
}

export const addInstructor = async instructorData => {
  const path = `school/instructor`
  const response = await post(path, instructorData)
  return response
}

export const updateInstructor = async (id, instructorData) => {
  const path = `school/instructor/${id}`
  const response = await put(path, instructorData)
  return response
}

export const removeInstructor = async instructorId => {
  const path = `school/instructor/${instructorId}`
  const response = await destroy(path, {})
  return response
}
