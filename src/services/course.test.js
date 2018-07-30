import { fetchCourses, getCourseSpaceText } from 'services/course'
import * as api from 'services/api'

global.localStorage = {
  getItem: jest.fn()
}

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

describe('fetchCourses', () => {
  it('Makes request with params', () => {
    api.get = jest.fn(() => {
      return {}
    })

    fetchCourses(1, '2018-01-01', '2018-01-30')

    expect(api.get).toHaveBeenCalledWith('school/1/course', {
      sdate: '2018-01-01',
      edate: '2018-01-30'
    })
  })

  it('Returns results', done => {
    const results = [{ id: 5 }]

    api.get = jest.fn(() => {
      return { results }
    })

    fetchCourses(1, '2018-01-01', '2018-01-30').then(res => {
      expect(res).toEqual(results)
      done()
    })
  })
})
