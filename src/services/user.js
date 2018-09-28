import { post } from 'services/api'

export const saveUser = async user => {
  const path = 'users/signup/'

  return await post(path, { ...user })
}

export const loginUser = async user => {
  const path = 'users/login/'

  return await post(path, { ...user })
}
