export const CBT_ROUTE = [
  'STEP_START',
  'STEP_LICENCE',
  'STEP_ITM',
  'STEP_REVISE',
  'STEP_CBT',
  'STEP_BIKE',
  'STEP_GEAR',
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
  'STEP_BIKE',
  'STEP_GEAR',
  'STEP_INSURE',
  'STEP_RIDE'
]

export const DEFAULT_TIMELINE = [
  { constant: 'STEP_START', name: 'Start', is_completed: true },
  { constant: 'STEP_LICENCE', name: 'Licence', is_completed: false },
  { constant: 'STEP_ITM', name: 'ITM', is_completed: false },
  { constant: 'STEP_REVISE', name: 'Revise', is_completed: false },
  { constant: 'STEP_CBT', name: 'CBT', is_completed: false },
  { constant: 'STEP_THEORY_TEST', name: 'Theory Test', is_completed: false },
  { constant: 'STEP_FULL_LICENCE', name: 'Full Licence', is_completed: false },
  { constant: 'STEP_BIKE', name: 'Bike', is_completed: false },
  { constant: 'STEP_GEAR', name: 'Gear', is_completed: false },
  { constant: 'STEP_INSURE', name: 'Insure', is_completed: false },
  { constant: 'STEP_RIDE', name: 'Ride', is_completed: false }
]
