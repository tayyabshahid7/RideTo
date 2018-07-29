import moment from 'moment'
import { get } from 'services/api'
import { s } from 'utils/helper'

export const getCourseSpaceText = course => {
  const availableSpaces = course.spaces - course.orders.length
  return availableSpaces === 0
    ? 'FULL'
    : `${availableSpaces} space${s(availableSpaces)} available`
}

export const getCoursesOnDay = (days, dateStr) => {
  return days
    .filter(day => moment(day.date).format('YYYY-MM-DD') === dateStr)
    .map(day => day.courses)
    .reduce(day => day[0])
}

export const fetchCourses = async (schoolId, startDate, endDate) => {
  const path = `school/${schoolId}/course`
  const params = {
    sdate: startDate,
    edate: endDate
  }

  const response = await get(path, params)

  return response.results
}
