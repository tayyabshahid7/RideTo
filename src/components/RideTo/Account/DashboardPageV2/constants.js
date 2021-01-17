export const CBT_ROUTE = [
  'STEP_START',
  'STEP_LICENCE',
  'STEP_ITM',
  'STEP_REVISE',
  'STEP_CBT',
  'STEP_GEAR',
  'STEP_BIKE',
  'STEP_INSURE',
  'STEP_RIDE'
]

export const FULL_LICENCE_ROUTE = [
  'STEP_START',
  'STEP_LICENCE',
  'STEP_ITM',
  'STEP_REVISE',
  'STEP_CBT',
  'STEP_THEORY_TEST',
  'STEP_FULL_LICENCE',
  'STEP_GEAR',
  'STEP_BIKE',
  'STEP_INSURE',
  'STEP_RIDE'
]

export const DEFAULT_TIMELINE = [
  {
    constant: 'STEP_START',
    name: 'Start',
    is_completed: true,
    achievements: []
  },
  {
    constant: 'STEP_LICENCE',
    name: 'Licence',
    is_completed: false,
    achievements: []
  },
  {
    constant: 'STEP_ITM',
    name: 'ITM',
    is_completed: false,
    achievements: ['ACHIEVEMENT_COMPLETED_ITM']
  },
  {
    constant: 'STEP_REVISE',
    name: 'Revise',
    is_completed: false,
    achievements: ['ACHIEVEMENT_COMPLETED_REVISION']
  },
  {
    constant: 'STEP_CBT',
    name: 'CBT',
    is_completed: false,
    achievements: ['ACHIEVEMENT_COMPLETED_CBT']
  },
  {
    constant: 'STEP_THEORY_TEST',
    name: 'Theory Test',
    is_completed: false,
    achievements: ['ACHIEVEMENT_THEORY_TEST_PASSED']
  },
  {
    constant: 'STEP_FULL_LICENCE',
    name: 'Full Licence',
    is_completed: false,
    achievements: [
      'ACHIEVEMENT_MODULE_ONE_PASSED',
      'ACHIEVEMENT_MODULE_TWO_PASSED',
      'ACHIEVEMENT_FULL_LICENCE'
    ]
  },
  {
    constant: 'STEP_GEAR',
    name: 'Gear',
    is_completed: false,
    achievements: ['ACHIEVEMENT_GET_THE_GEAR']
  },
  {
    constant: 'STEP_BIKE',
    name: 'Bike',
    is_completed: false,
    achievements: []
  },
  {
    constant: 'STEP_INSURE',
    name: 'Insure',
    is_completed: false,
    achievements: ['ACHIEVEMENT_BOOKED_TEST_RIDE']
  },
  {
    constant: 'STEP_RIDE',
    name: 'Ride',
    is_completed: false,
    achievements: []
  }
]
