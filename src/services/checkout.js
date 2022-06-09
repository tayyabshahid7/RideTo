import { post } from 'services/api'

export const createPlatformOrder = async (data, auth = false) => {
  return await post('v2/orders', data, auth)
}
