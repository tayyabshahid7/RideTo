export const CALENDAR_VIEW = {
  MONTH: 'month',
  WEEK: 'week'
}

export const DATE_FORMAT = 'YYYY-MM-DD'

export const DAY_FORMAT1 = 'dddd Do MMMM'
export const DAY_FORMAT2 = 'dddd Do MMMM YYYY'
export const DAY_FORMAT3 = 'YYYY-MM-DDTHH:mm'
export const DAY_FORMAT4 = 'YYYY-MM-DDTHH:mm:ssZ'
export const DAY_FORMAT5 = 'ddd Do MMMM'

export const WEEK_VIEW_START_TIME = 60 * 60 * 7 // 9 AM
export const WEEK_VIEW_START_TIME_STRING = '07:00'
export const WORK_HOURS = 12
export const SINGLE_DAY_IN_SECONDS = 60 * 60 * 24

// export const COLOR_RED_1 = '#fa0e0e'
// export const COLOR_YELLOW_1 = '#fa840e'
export const BIKE_HIRE = {
  MANUAL: 'manual',
  AUTO: 'auto',
  NO: 'no'
}

export const RIDING_EXPERIENCE = {
  CYCLING: 'Cycling experience',
  ONROAD_MOTORCYCLING: 'On road motorcycling',
  OFFROAD_MOTORCYCLING: 'Off road motorcycling'
}

export const SORTBY = {
  DISTANCE: 'distance',
  PRICE_DOWN_UP: 'price',
  PRICE_UP_DOWN: '-price',
  RATING: '-rating'
}

export const MAPBOX_KEY = process.env.REACT_APP_MAPBOX_KEY

export const RIDER_TYPE = {
  SOCIAL: 'RIDER_TYPE_SOCIAL',
  CAREER: 'RIDER_TYPE_CAREER',
  COMMUTER: 'RIDER_TYPE_COMMUTER'
}

export const PHONE_NUMBER_LENGTH = 13