import { get, put } from 'services/api'

export const getSettings = async () => {
  const path = `school/settings/`
  const response = await get(path)
  return response
}

export const saveSettings = async (params = {}) => {
  const path = `school/settings/`
  const response = await put(path, params)

  return response
}
