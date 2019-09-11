import { post } from 'services/api'
import { getBikeHireOptions } from 'services/order'
import { FULL_LICENCE_MODULES } from 'common/constants'
import moment from 'moment'

export const createStripeToken = async (stripe, data) => {
  return await stripe.createToken({ ...data })
}

export const createOrder = async (data, auth = false) => {
  return await post('orders', data, auth)
}

export const getInitialSuppliers = () => {
  return window.RIDE_TO_DATA.widget_locations
    .filter(({ courses }) => courses.length)
    .map(supplier => ({
      ...supplier,
      courses: supplier.courses.filter(
        ({ constant }) => !FULL_LICENCE_MODULES.includes(constant)
      )
    }))
}

export const getAddress = loc => {
  return `${loc.address_1}, ${loc.town}, ${loc.postcode}`
}

export const getStartInTime = (now, startTime) => {
  const days = startTime.diff(now, 'days')
  const hours = startTime.diff(now, 'hours') % 24.0
  const minutes = startTime.diff(now, 'minutes') % 60.0

  return [
    days === 1 ? '1 day' : days > 1 ? `${days} days` : '',
    hours === 1 ? '1 hour' : hours > 1 ? `${hours} hours` : '',
    minutes ? `${minutes} minutes` : ''
  ]
    .filter(s => s)
    .join(', ')
}

export const getMotorbikeLabel = (bikeHire, isFullLicence) => {
  return getBikeHireOptions(isFullLicence)[bikeHire]
}

export const getTotalOrderPrice = (course, bikeHire, discount = 0) => {
  const { pricing } = course
  const subTotal =
    bikeHire && bikeHire !== 'no'
      ? pricing.price + pricing.bike_hire_cost
      : pricing.price

  return subTotal - discount
}

export const asPoundSterling = pennies => {
  return `£${Math.floor(pennies / 100.0)}`
}

export const showOwnBikeHire = courseType => {
  return courseType.name === 'CBT Training Renewal'
}

export const getValidCourses = courses => {
  const dates = courses
    .filter(({ date, time }) => {
      const isToday = date === moment().format('YYYY-MM-DD')

      if (
        isToday &&
        time >
          moment()
            .add(2, 'hours')
            .format('HH:mm:ss')
      ) {
        return true
      }

      if (
        !isToday &&
        date >
          moment()
            .subtract(1, 'days')
            .format('YYYY-MM-DD')
      ) {
        return true
      }

      return false
    })
    .sort(
      (a, b) =>
        new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`)
    )

  return dates
}

export const getEarliestCourse = courses => {
  const dates = getValidCourses(courses)

  return dates.length ? dates[0] : null
}

export const getEarliestDate = courses => {
  const course = getEarliestCourse(courses)

  return course ? moment(course.date, 'YYYY-MM-DD') : null
}
