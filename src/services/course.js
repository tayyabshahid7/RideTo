import moment from 'moment'
import { get, destroy, post, put, patch } from 'services/api'
import { s } from 'utils/helper'
import { Features } from 'common/info'

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

export const fetchRidetoCourses = async params => {
  const path = `courses/`

  const response = await get(path, params, false)

  return response
}

export const fetchWidgetCourses = async (
  schoolId,
  startDate,
  endDate,
  courseType
) => {
  const path = `school/${schoolId}/widget/course`
  const params = {
    sdate: startDate,
    edate: endDate,
    ordering: 'time',
    course_type: courseType
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

export const getDasBikeTypes = async schoolId => {
  const path = `das/${schoolId}`
  const response = await get(path, {}, false)
  return response
}

export const getDasAvailableDates = async (
  schoolId,
  full_licence_type,
  bike_type,
  course_type,
  start_date
) => {
  const path = `das/${schoolId}/dates`
  let data = {
    full_licence_type,
    bike_type,
    course_type,
    start_date
  }
  start_date && (data.start_date = start_date)
  const response = await get(path, data)
  return response
}

export const getPricingForCourse = async (schoolId, course_type, datetime) => {
  const path = `school/${schoolId}/pricing`
  const response = await get(path, { course_type, datetime })
  return response
}

export const getPrice = async ({
  supplierId,
  date,
  course_type,
  courseId,
  voucher_code = null
}) => {
  const path = 'get-price'
  let params = courseId
    ? { course_id: courseId }
    : { course_type, date, supplier_id: supplierId }
  if (voucher_code) params.voucher_code = voucher_code
  const response = await get(path, params, false)
  return response
}

export const getShortCourseType = courseType => {
  switch (courseType.constant) {
    case 'LICENCE_CBT':
      return 'CBT'
    case 'LICENCE_CBT_RENEWAL':
      return 'Renewal'
    case 'INTRO_TO_MOTORCYCLING':
      return 'ITM'
    case 'FULL_LICENCE':
      return 'Full'
    default:
      return 'CBT'
  }
}

export const getCourseTitle = courseTypeConstant => {
  switch (courseTypeConstant) {
    case 'LICENCE_CBT':
      return 'CBT Training'
    case 'LICENCE_CBT_RENEWAL':
      return 'CBT Renewal'
    case 'INTRO_TO_MOTORCYCLING':
      return 'ITM Training'
    case 'FULL_LICENCE':
      return 'Full Licence'
    default:
      return 'CBT Training'
  }
}

export const createBulkSchoolCourse = async (schoolId, data) => {
  const path = `school/${schoolId}/course/bulk`
  const response = await post(path, data)
  return response
}

export const getFeatureInfo = featureName => {
  let feature = Features.find(f => f.value === featureName)
  return feature || {}
}

export const fetchAvailableCoursesDates = async (
  startDate,
  endDate,
  courseType
) => {
  const path = 'courses/avialable-dates/'
  const params = {
    sdate: startDate,
    edate: endDate,
    course_type: courseType
  }
  const authRequired = false
  const response = await get(path, params, authRequired)

  return response
}
