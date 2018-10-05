import { get, post } from 'services/api'

export const saveUser = async user => {
  const path = 'users/signup/'

  return await post(path, { ...user }, false)
}

export const fetchUser = async () => {
  return await get('users/')
}
