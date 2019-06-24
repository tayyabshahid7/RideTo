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
  let params = {
    ordering: 'time',
    course_type: courseType
  }

  if (courseType !== 'FULL_LICENCE') {
    params = {
      ...params,
      sdate: startDate,
      edate: endDate
    }
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

export const addSchoolPayment = async (schoolId, data) => {
  const path = `school/${schoolId}/course/payment`
  const response = await post(path, data)
  return response
}

export const fetchSchoolOrder = async (schoolId, trainingId) => {
  const path = `school/${schoolId}/course/order/${trainingId}`
  const response = await get(path, {})
  return response
}

export const updateSchoolOrder = async (schoolId, friendlyId, order) => {
  const path = `school/${schoolId}/course/order/${friendlyId}`
  const response = await put(path, order)
  return response
}

export const deleteSchoolOrderTraining = async (schoolId, trainingId) => {
  const path = `school/${schoolId}/course/order/training/${trainingId}`
  const response = await destroy(path, {})
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
  const response = await get(path, data, false)
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
  voucher_code = null,
  hours,
  full_licence_course_id
}) => {
  const path = 'get-price'
  let params = courseId
    ? { course_id: courseId }
    : {
        course_type,
        date,
        supplier_id: supplierId,
        hours,
        ...(full_licence_course_id && { course_id: full_licence_course_id })
      }
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
    case 'FULL_LICENCE_MOD1_TRAINING':
      return 'Module 1 Training'
    case 'FULL_LICENCE_MOD1_TEST':
      return 'Module 1 Test'
    case 'FULL_LICENCE_MOD2_TRAINING':
      return 'Module 2 Training'
    case 'FULL_LICENCE_MOD2_TEST':
      return 'Module 2 Test'
    case 'ENHANCED_RIDER_SCHEME':
      return 'Enhanced Rider Scheme'
    case 'BIKE_HIRE':
      return 'Bike Hire'
    case 'TFL_ONE_ON_ONE':
      return 'TFL'
    case 'OFF_ROAD_TEST':
      return 'Off Road Training'
    default:
      return 'CBT'
  }
}

export const getMediumCourseType = courseType => {
  switch (courseType.constant) {
    case 'LICENCE_CBT':
      return 'CBT'
    case 'LICENCE_CBT_RENEWAL':
      return 'CBT renewal'
    case 'INTRO_TO_MOTORCYCLING':
      return 'ITM'
    case 'FULL_LICENCE':
      return 'Full licence'
    case 'FULL_LICENCE_MOD1_TRAINING':
      return 'Module 1 Training'
    case 'FULL_LICENCE_MOD1_TEST':
      return 'Module 1 Test'
    case 'FULL_LICENCE_MOD2_TRAINING':
      return 'Module 2 Training'
    case 'FULL_LICENCE_MOD2_TEST':
      return 'Module 2 Test'
    case 'ENHANCED_RIDER_SCHEME':
      return 'Enhanced Rider Scheme'
    case 'BIKE_HIRE':
      return 'Bike Hire'
    case 'TFL_ONE_ON_ONE':
      return 'TFL'
    case 'OFF_ROAD_TEST':
      return 'Off Road Training'
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
    case 'FULL_LICENCE_MOD1_TRAINING':
      return 'Full Licence Module 1 Training'
    case 'FULL_LICENCE_MOD1_TEST':
      return 'Full Licence Module 1 Test'
    case 'FULL_LICENCE_MOD2_TRAINING':
      return 'Full Licence Module 2 Training'
    case 'FULL_LICENCE_MOD2_TEST':
      return 'Full Licence Module 2 Test'
    case 'TFL_ONE_ON_ONE':
      return 'Free 1-2-1 Skills course'
    case 'OFF_ROAD_TEST':
      return 'Off Road Training'
    default:
      return 'CBT Training'
  }
}

export const getLicenceAge = courseTypeConstant => {
  switch (courseTypeConstant) {
    case 'FULL_LICENCE_TYPE_A1':
      return 17
    case 'FULL_LICENCE_TYPE_A2':
      return 19
    default:
      return 24
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

export const fetchDayCourseTimes = async (
  schoolId,
  date,
  course_type,
  bike_type,
  full_licence_type
) => {
  const path = `school/${schoolId}/course/times`
  const params = {
    date,
    course_type,
    bike_type
  }

  if (full_licence_type) {
    params.full_licence_type = full_licence_type
  }

  const authRequired = false
  const response = await get(path, params, authRequired)

  return response
}

export const fetchDasPackagePrice = async schoolId => {
  const path = `school/${schoolId}/get-das-package-price`
  const response = await get(path, {}, false)
  return response
}

export const findResultsCourseWithId = (courses, id) => {
  return (
    courses.available.filter(course => course.id === parseInt(id, 10))[0] ||
    courses.unavailable.filter(course => course.id === parseInt(id, 10))[0] ||
    null
  )
}

export const getCourseIdFromSearch = search => {
  const params = new URLSearchParams(search)
  const courseId = parseInt(params.get('courseId'), 10)
  return courseId || null
}
