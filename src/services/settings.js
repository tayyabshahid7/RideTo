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

export const getWidgetSettings = async () => {
  const path = `school/settings/widget/`
  const response = await get(path)
  return response
}

export const saveWidgetSettings = async (params = {}) => {
  const path = `school/settings/widget/`
  const response = await put(path, params)
  return response
}