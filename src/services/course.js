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
  let day = days.find(day => moment(day.date).format('YYYY-MM-DD') === dateStr)
  if (!day) {
    return []
  }
  return day.courses
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

export const fetchDayCourses = async (schoolId, date) => {
  // TODO: Update this once API is ready
  const path = `school/${schoolId}/course/day`
  const params = {
    date: date
  }

  const response = await get(path, params)

  return response.results
}

export const fetchSingleCourse = async (schoolId, courseId) => {
  const path = `school/${schoolId}/course/${courseId}`

  const response = await get(path, {})

  return response
}
