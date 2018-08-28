import moment from 'moment'
import { getInitialSuppliers, getStartInTime } from 'services/widget'

global.RIDE_TO_DATA = {
  widget_locations: [
    { id: 1, courses: [{}] },
    { id: 2, courses: [{}] },
    { id: 2, courses: [] }
  ]
}

describe('getInitialSuppliers', () => {
  it('Filter empty courses', () => {
    expect(getInitialSuppliers().length).toBe(2)
  })
})

describe('getStartInTime', () => {
  it('Full days, hours, minutes', () => {
    const now = moment('2018-08-01 13:40:20', 'YYYY-MM-DD hh:mm:ss')
    const future = moment('2018-08-04 17:49:43', 'YYYY-MM-DD hh:mm:ss')

    expect(getStartInTime(now, future)).toBe('3 days, 4 hours, 9 minutes')
  })

  it('Single day', () => {
    const now = moment('2018-08-01 13:40:20', 'YYYY-MM-DD hh:mm:ss')
    const future = moment('2018-08-02 13:40:43', 'YYYY-MM-DD hh:mm:ss')

    expect(getStartInTime(now, future)).toBe('1 day')
  })

  it('Single hour', () => {
    const now = moment('2018-08-01 13:40:20', 'YYYY-MM-DD hh:mm:ss')
    const future = moment('2018-08-01 14:40:43', 'YYYY-MM-DD hh:mm:ss')

    expect(getStartInTime(now, future)).toBe('1 hour')
  })

  it('No minutes', () => {
    const now = moment('2018-08-01 13:40:20', 'YYYY-MM-DD hh:mm:ss')
    const future = moment('2018-08-02 17:40:43', 'YYYY-MM-DD hh:mm:ss')

    expect(getStartInTime(now, future)).toBe('1 day, 4 hours')
  })
})
