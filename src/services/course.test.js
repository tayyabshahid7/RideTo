import { getCourseSpaceText } from 'services/course'

const COURSE = {
  id: 1,
  course_type: {},
  date: '2018-07-25',
  time: '08:00:00',
  spaces: 4,
  orders: [{}, {}],
  supplier: 697
}

describe('getCourseSpaceText', () => {
  it('Course full', () => {
    const course = { ...COURSE, spaces: 2 }

    const expected = 'FULL'
    expect(getCourseSpaceText(course)).toBe(expected)
  })

  it('1 space', () => {
    const course = { ...COURSE, spaces: 3 }

    const expected = '1 space available'
    expect(getCourseSpaceText(course)).toBe(expected)
  })

  it('2 spaces', () => {
    const course = { ...COURSE, spaces: 4 }

    const expected = '2 spaces available'
    expect(getCourseSpaceText(course)).toBe(expected)
  })
})
