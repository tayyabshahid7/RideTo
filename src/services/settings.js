import { get, put } from 'services/api'

export const getDefaultDays = async schoolId => {
  const path = `school/${schoolId}/default-open-days`
  const response = await get(path, {})
  return response
}

export const saveDefaultDays = async (params = {}, schoolId) => {
  const path = `school/${schoolId}/default-open-days`
  const response = await put(path, params)
  return response
}

export const getSettings = async () => {
  const path = `school/settings/`
  const response = await get(path, {})
  return response
}

export const saveSettings = async (params = {}) => {
  const path = `school/settings/`
  const response = await put(path, params)

  return response
}

export const saveOrderCancelSetting = async value => {
  const path = `school/space-available/`
  const response = await put(path, { space_available_delete_course: value })
  return response
}

export const getOrderCancelSetting = async () => {
  const path = `school/space-available/`
  return await get(path)
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

export const mapLabelColours = (settings, slug) => {
  const name =
    slug
      .replace(/-/g, '_')
      .replace('introduction_to_motorcycling', 'itm_training')
      .replace('motorcycle_licence', 'das_training')
      .replace('training_renewal', 'renewal') + '_color'

  return { settingName: name, color: settings[name] }
}

export const mapLabelColoursWithContant = (settings, constant) => {
  if (constant === 'EVENT') {
    return '#ebebeb'
  }

  return '#fff'
}
