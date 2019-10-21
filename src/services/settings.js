import { get, put } from 'services/api'
import { CALENDAR_COLOURS } from 'common/constants'

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
  if (!settings) {
    return CALENDAR_COLOURS[constant]
  }

  switch (constant) {
    case 'LICENCE_CBT':
      return settings.cbt_training_color
    case 'LICENCE_CBT_RENEWAL':
      return settings.cbt_renewal_color
    case 'FULL_LICENCE_MOD1_TRAINING':
    case 'FULL_LICENCE_MOD1_TEST':
    case 'FULL_LICENCE_MOD2_TRAINING':
    case 'FULL_LICENCE_MOD2_TEST':
      return settings.das_training_color
    case 'INTRO_TO_MOTORCYCLING':
      return settings.itm_training_color
    default:
      return CALENDAR_COLOURS[constant]
  }
}
