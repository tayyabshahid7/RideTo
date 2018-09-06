import moment from 'moment'
import { get, destroy, post, put, patch } from 'services/api'
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

  return response
}

export const fetchWidgetCourses = async (schoolId, startDate, endDate) => {
  const path = `school/${schoolId}/widget/course`
  const params = {
    sdate: startDate,
    edate: endDate,
    ordering: 'time'
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

export const fetchWidgetSingleCourse = async (schoolId, courseId) => {
  const path = `school/${schoolId}/widget/course/${courseId}`
  const response = await get(path, {})

  return response
}

export const deleteSingleCourse = async (schoolId, courseId) => {
  const path = `school/${schoolId}/course/${courseId}`

  const response = await destroy(path, {})

  return response
}

export const addSchoolOrder = async (schoolId, order) => {
  const path = `school/${schoolId}/course/order`
  const response = await post(path, order)
  return response
}

export const fetchSchoolOrder = async (schoolId, friendlyId) => {
  const path = `school/${schoolId}/course/order/${friendlyId}`
  const response = await get(path, {})
  return response
}

export const updateSchoolOrder = async (schoolId, friendlyId, order) => {
  const path = `school/${schoolId}/course/order/${friendlyId}`
  const response = await put(path, order)
  return response
}

export const updateSchoolCourse = async (
  schoolId,
  courseId,
  data,
  fullUpdate = false
) => {
  const path = `school/${schoolId}/course/${courseId}`
  let response
  if (fullUpdate) {
    response = await put(path, data)
  } else {
    response = await patch(path, data)
  }
  return response
}

export const createSchoolCourse = async (schoolId, data) => {
  const path = `school/${schoolId}/course`
  const response = await post(path, data)
  return response
}

export const getCourseTypes = async schoolId => {
  const path = `school/${schoolId}/course/type`
  const response = await get(path)
  return response
}

export const getPricingForCourse = async (schoolId, course_type, datetime) => {
  const path = `school/${schoolId}/pricing`
  const response = await get(path, { course_type, datetime })
  return response
}

export const getShortCourseType = courseType => {
  switch (courseType.constant) {
    case 'LICENCE_CBT':
      return 'CBT'
    case 'LICENCE_CBT_RENEWAL':
      return 'Renewal'
    default:
      return 'CBT'
  }
}

export const createBulkSchoolCourse = async (schoolId, data) => {
  const path = `school/${schoolId}/course/bulk`
  const response = await post(path, data)
  return response
}
