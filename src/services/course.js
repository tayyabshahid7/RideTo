import moment from 'moment'
import { get, destroy, post, put, patch } from 'services/api'
import { s } from 'utils/helper'
import { Features } from 'common/info'
import { parseQueryString } from 'services/api'
import { getStaticData } from 'services/page'

export const getCourseSpaceText = course => {
  const availableSpaces = course.spaces - course.orders.length
  return availableSpaces === 0
    ? 'FULL'
    : `${availableSpaces} space${s(availableSpaces)} available`
}

export const getCourseSpaceTextShort = course => {
  const availableSpaces = course.spaces_available
  return availableSpaces === 0
    ? 'Full'
    : `${availableSpaces} Space${s(availableSpaces)} left`
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

export const fetchCoursesMinimal = async (schoolId, startDate, endDate) => {
  const path = `school/${schoolId}/course/minimal`
  const params = {
    sdate: startDate,
    edate: endDate
  }

  const response = await get(path, params)

  return response
}

export const fetchRidetoCourses = async params => {
  // const path = `courses/`
  const path = `courses-new/`

  const response = await get(path, params, false)

  return response
}

export const fetchSingleRidetoCourse = async id => {
  const staticData = getStaticData('RIDETO_PAGE')
  const qs = parseQueryString(window.location.search.slice(1))
  const postcode = staticData.postcode || qs.postcode || ''
  const courseType = staticData.courseType || qs.courseType || ''

  const path = `courses-new/${id}/`

  const response = await get(path, { course_type: courseType, postcode }, false)

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

export const fetchSingleCourse = async courseId => {
  const path = `school/course/${courseId}`

  const response = await get(path, {})

  return response
}

export const fetchWidgetSingleCourse = async (schoolId, courseId) => {
  const path = `school/${schoolId}/widget/course/${courseId}`
  const response = await get(path, {})

  return response
}

export const fetchWidgetSingleCourseWithDiscount = async (
  schoolId,
  courseId,
  voucher_code
) => {
  const path = `school/${schoolId}/widget/course/${courseId}`
  const response = await get(path, { voucher_code })

  return response
}

export const deleteSingleCourse = async courseId => {
  const path = `school/course/${courseId}`

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

export const updateSchoolTrainingRejectionWithAlternativeDates = async (
  params,
  orderId
) => {
  const path = `o/alternative-dates/${orderId}/`
  const response = await put(path, params, false)
  return response
}

export const updateSchoolTrainingRejectionWithAlternativeSchool = async (
  params,
  orderId
) => {
  const path = `o/alternative-schools/${orderId}/`
  const response = await put(path, params, false)
  return response
}

export const deleteSchoolOrderTraining = async (schoolId, trainingId) => {
  const path = `school/${schoolId}/course/order/training/${trainingId}`
  const response = await destroy(path, {})
  return response
}

export const updateSchoolCourse = async (
  courseId,
  data,
  fullUpdate = false
) => {
  const path = `school/course/${courseId}`
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
  full_licence_course_id,
  order_source,
  highway_code = false
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
  if (order_source) params.order_source = order_source
  params.highway_code = highway_code
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
    case 'OFF_ROAD_TRAINING':
      return 'Off Road Training'
    case 'GEAR_CONVERSION_COURSE':
      return 'Gear Conversion'
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
    case 'OFF_ROAD_TRAINING':
      return 'Off Road Training'
    case 'GEAR_CONVERSION_COURSE':
      return 'Gear Conversion'
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
    case 'OFF_ROAD_TRAINING':
      return 'Off Road Training'
    case 'GEAR_CONVERSION_COURSE':
      return 'Gear Conversion Course'
    case 'ENHANCED_RIDER_SCHEME':
      return 'Enhanced Rider Scheme'
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

export const calcFullLicencePrices = (pricePerHour, hours, addons = []) => {
  const formatNum = num => {
    return parseFloat(num)
      .toFixed(2)
      .replace('.00', '')
  }

  const addonsPrice = addons.reduce(
    (total, addon) => (total += parseFloat(addon.discount_price)),
    0
  )
  const total = (pricePerHour / 100) * hours
  const now = 25 + addonsPrice
  const later = total - 25

  return [formatNum(now), formatNum(later)]
}

export const getDefaultFullLicencePackage = ({
  old,
  long,
  miles,
  bike,
  size
}) => {
  let bikeHire = 'manual'
  let licenceType = null
  let packageHours = null

  if (old === '17-18') {
    licenceType = 'A1'
  } else if (old === '19-23') {
    licenceType = 'A2'
  } else {
    licenceType = 'A'
  }

  if (long === '0-3 Months' || ['None', 'Less than 500'].includes(miles)) {
    packageHours = 16
  } else if (long === '3-6 Months') {
    packageHours = 40
  } else if (long === '6+ Months') {
    if (bike === 'Automatic') {
      packageHours = 40
    } else if (miles === '500-1,500') {
      if (size === '125cc') {
        packageHours = 40
      } else if (size === 'More than 125cc') {
        packageHours = 30
      }
    } else if (miles === '1,500+') {
      packageHours = 30
    }
  }

  return [bikeHire, licenceType, packageHours]
}

export const getTrainingStatus = status => {
  if (status === 'TRAINING_WAITING_SCHOOL_CONFIRMATION') {
    return 'Pending Instructor Confirmation'
  } else if (status === 'TRAINING_WAITING_RIDER_CONFIRMATION') {
    return 'Date Unavailable. Please check your email'
  } else if (status === 'TRAINING_CONFIRMED') {
    return 'Training Confirmed'
  } else if (status === 'TRAINING_CANCELLED') {
    return 'Training Cancelled'
  } else if (status === 'TRAINING_FAILED') {
    return 'Training Not Completed'
  } else if (status === 'TRAINING_NO_SHOW') {
    return 'Not attended'
  } else if (status === 'TRAINING_PASSED') {
    return 'Completed'
  } else {
    return status
  }
}

export const filterExtraCourses = type => {
  return (
    !(
      type.constant.startsWith('FULL_LICENCE') && type.constant.endsWith('TEST')
    ) && type.constant !== 'FULL_LICENCE'
  )
}
