import { get, post, put, destroy } from 'services/api'

export const fetchUsers = async schoolId => {
  const path = `school/${schoolId}/list-users`
  const { results } = await get(path)
  return results
}

export const addUser = async (schoolId, userData) => {
  const path = `school/${schoolId}/create-user`
  const response = await post(path, userData)
  return response
}

export const updateUser = async (schoolId, userData) => {
  const path = `school/${schoolId}/user/${userData.user}`
  const response = await put(path, userData)
  return response
}

export const removeUser = async (schoolId, userId) => {
  const path = `school/${schoolId}/user/${userId}`
  const response = await destroy(path, {})
  return response
}
