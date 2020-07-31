export const CALENDAR_VIEW = {
  MONTH: 'month',
  WEEK: 'week',
  DAY: 'day',
  SHIFT: 'shift'
}

export const DATE_FORMAT = 'YYYY-MM-DD'

export const DAY_FORMAT1 = 'dddd Do MMMM'
export const DAY_FORMAT2 = 'dddd Do MMMM YYYY'
export const DAY_FORMAT3 = 'YYYY-MM-DDTHH:mm'
export const DAY_FORMAT4 = 'YYYY-MM-DDTHH:mm:ssZ'
export const DAY_FORMAT5 = 'ddd Do MMMM'

export const SHIFT_TYPES = [
  { id: 'EVENT_SHIFT', name: 'Shift' },
  { id: 'EVENT_BLOCKER', name: 'Blocker' },
  { id: 'EVENT_HOLIDAY', name: 'Holiday' },
  { id: 'EVENT_SICK_DAY', name: 'Sick Day' }
]

export const WEEK_START_HOUR = 7
export const WEEK_VIEW_START_TIME = 60 * 60 * WEEK_START_HOUR // Midnight
export const WEEK_VIEW_START_TIME_STRING = '00:00'
export const WEEK_VIEW_WORKING_DAY_TIME_STRING = '07:00'
export const WORK_HOURS = 14
export const SINGLE_DAY_IN_SECONDS = 60 * 60 * 24

// export const COLOR_RED_1 = '#fa0e0e'
// export const COLOR_YELLOW_1 = '#fa840e'
export const BIKE_HIRE = {
  MANUAL: 'manual',
  AUTO: 'auto',
  NO: 'no',
  AUTO_125CC: 'AUTO_125CC',
  MANUAL_50CC: 'MANUAL_50CC'
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

export const BANK_HOLIDAYS = [
  '25-12-2018',
  '26-12-2018',
  '01-01-2019',
  '19-04-2019',
  '22-04-2019',
  '06-05-2019',
  '27-05-2019',
  '26-08-2019',
  '25-12-2019',
  '26-12-2019',
  '01-01-2020'
]

export const AVAILABLE_COURSE_TYPES = [
  'INTRO_TO_MOTORCYCLING',
  'LICENCE_CBT',
  'LICENCE_CBT_RENEWAL',
  'FULL_LICENCE',
  'GEAR_CONVERSION_COURSE'
]

export const LICENCE_TYPES = {
  A1: 'FULL_LICENCE_TYPE_A1',
  A2: 'FULL_LICENCE_TYPE_A2',
  A: 'FULL_LICENCE_TYPE_A'
}

export const SHORT_LICENCE_TYPES = {
  FULL_LICENCE_TYPE_A1: 'A1',
  FULL_LICENCE_TYPE_A2: 'A2',
  FULL_LICENCE_TYPE_A: 'A'
}

export const LICENCE_TYPES_AGES = {
  FULL_LICENCE_TYPE_A1: 17,
  FULL_LICENCE_TYPE_A2: 19,
  FULL_LICENCE_TYPE_A: 24
}

export const FULL_LICENCE_MODULES = [
  'FULL_LICENCE_MOD1_TRAINING',
  'FULL_LICENCE_MOD1_TEST',
  'FULL_LICENCE_MOD2_TRAINING',
  'FULL_LICENCE_MOD2_TEST'
]

export const COURSETYPE_ORDER = [
  'LICENCE_CBT',
  'LICENCE_CBT_RENEWAL',
  'FULL_LICENCE',
  'INTRO_TO_MOTORCYCLING',
  'TFL_ONE_ON_ONE',
  'GEAR_CONVERSION_COURSE'
]

export const COURSETYPE_ORDER_SLIDER = COURSETYPE_ORDER.filter(
  course => course !== 'TFL_ONE_ON_ONE'
)

export const TEST_STATUS_CHOICES = {
  TEST_STATUS_NO_BOOKING: 'No Booking',
  TEST_STATUS_NO_NAME: 'Booked, NO Name',
  TEST_STATUS_NAMED: 'Booked, Named'
}

export const STRIPE_KEY = process.env.REACT_APP_STRIPE_KEY

export const SLUG_COURSE_TYPES = {
  'introduction-to-motorcycling': 'INTRO_TO_MOTORCYCLING',
  'cbt-training': 'LICENCE_CBT',
  'blog/cbt-renewal': 'LICENCE_CBT_RENEWAL',
  'motorcycle-licence': 'FULL_LICENCE',
  '1-2-1-motorcycle-skills': 'TFL_ONE_ON_ONE',
  'gear-conversion-course': 'GEAR_CONVERSION_COURSE'
}

export const CALENDAR_COLOURS = {
  LICENCE_CBT: '#ffcfa0',
  LICENCE_CBT_RENEWAL: '#f3dad8',
  FULL_LICENCE_MOD1_TRAINING: '#9fe6ea',
  FULL_LICENCE_MOD1_TEST: '#d6d9ce',
  FULL_LICENCE_MOD2_TRAINING: '#cfcfea',
  FULL_LICENCE_MOD2_TEST: '#caffd0',
  INTRO_TO_MOTORCYCLING: '#c9e4e7',
  TFL_ONE_ON_ONE: '#84dcc6',
  GEAR_CONVERSION_COURSE: '#e0fff9',
  INSTRUCTOR: '#a5bbff',
  EVENT: '#ebebeb'
}
