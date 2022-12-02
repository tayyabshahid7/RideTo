import { BIKE_HIRE } from 'common/constants'
import moment from 'moment'
import { post } from 'services/api'
import { getBikeHireOptions } from 'services/order'

export const createStripeToken = async (stripe, data) => {
  return await stripe.createToken({ ...data })
}

export const createOrder = async (data, auth = false) => {
  return await post('orders', data, auth)
}

export const getInitialSuppliers = () => {
  return window.RIDE_TO_DATA.widget_locations
    .map(supplier => ({
      ...supplier,
      courses: supplier.courses.filter(
        course =>
          course &&
          course.constant &&
          !course.constant.startsWith('FULL_LICENCE')
      )
    }))
    .filter(supplier => supplier.courses.length)
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

export const getMotorbikeLabel = (bikeHire, isFullLicence, isInstantBook) => {
  const simpleLabels = {
    auto: !isFullLicence ? 'Automatic Scooter' : 'Automatic',
    auto_50cc: !isFullLicence
      ? 'Automatic 50cc Scooter'
      : 'Automatic 50cc Scooter',
    manual: !isFullLicence ? 'Manual 125cc Motorcycle' : 'Manual',
    no: 'Own Bike'
  }

  if (['auto', 'auto_50cc', 'manual', 'no'].includes(bikeHire)) {
    return simpleLabels[bikeHire]
  }

  return getBikeHireOptions(isFullLicence, isInstantBook)[bikeHire]
}

export const getTotalOrderPrice = (course, bikeHire, discount = 0) => {
  const { pricing } = course

  let subTotal =
    bikeHire && bikeHire !== BIKE_HIRE.NO
      ? pricing.price + pricing.bike_hire_cost
      : pricing.price

  if (bikeHire === BIKE_HIRE.MANUAL && pricing.bike_type_manual_price) {
    subTotal = pricing.price + pricing.bike_type_manual_price
  }

  if (bikeHire === BIKE_HIRE.AUTO && pricing.bike_type_auto_price) {
    subTotal = pricing.price + pricing.bike_type_auto_price
  }

  if (bikeHire === BIKE_HIRE.AUTO_50CC && pricing.bike_type_auto_50_price) {
    subTotal = pricing.price + pricing.bike_type_auto_50_price
  }

  if (bikeHire === BIKE_HIRE.AUTO_125CC && pricing.bike_type_auto_125_price) {
    subTotal = pricing.price + pricing.bike_type_auto_125_price
  }

  if (bikeHire === BIKE_HIRE.MANUAL_50CC && pricing.bike_type_manual_50_price) {
    subTotal = pricing.price + pricing.bike_type_manual_50_price
  }

  if (bikeHire === BIKE_HIRE.MANUAL_50CC && pricing.bike_type_manual_50_price) {
    subTotal = pricing.price + pricing.bike_type_manual_50_price
  }

  return subTotal - discount
}

export const asPoundSterling = pennies => {
  return `£${Math.floor(pennies / 100.0)}`
}

export const showOwnBikeHire = courseType => {
  return (
    courseType.name === 'CBT Training Renewal' || courseType.constant === 'MOT'
  )
}

export const getValidCourses = courses => {
  if (window.RIDE_TO_DATA.widget_initial.disabled_widget_cuttoff_time) {
    let currentTime = moment()
    const dates = courses
      .filter(({ date, time }) => {
        const courseStartDate = moment(`${date} ${time}`)
        return currentTime.isBefore(courseStartDate.subtract({ hours: 2 }))
      })
      .sort(
        (a, b) =>
          new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`)
      )

    return dates
  } else {
    const defaultCutOffTime = '18:00:00'
    const cutOffTime =
      window.RIDE_TO_DATA.widget_initial.last_time_book || defaultCutOffTime
    const [cutOffHours, cutOffMinutes, cutOffSeconds] = cutOffTime.split(':')

    let today = moment()
    let tomorrow = moment()
      .add(1, 'days')
      .hours(parseInt(cutOffHours))
      .minutes(parseInt(cutOffMinutes))
      .seconds(parseInt(cutOffSeconds))

    const dates = courses
      .filter(({ date, time }) => {
        let momentDate = moment(date)
        let dateInString = momentDate.format('YYYY-MM-DD')

        if (momentDate.isSameOrBefore(today)) {
          return false
        } else if (
          moment(dateInString).isSame(tomorrow.format('YYYY-MM-DD')) &&
          (today.hour() > tomorrow.hour() ||
            (today.hour() === tomorrow.hour() &&
              today.minute() > tomorrow.minute()))
        ) {
          return false
        }

        return true
      })
      .sort(
        (a, b) =>
          new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`)
      )

    return dates
  }
}
export const getEarliestCourse = courses => {
  const dates = getValidCourses(courses)

  return dates.length ? dates[0] : null
}

export const getEarliestDate = courses => {
  const course = getEarliestCourse(courses)

  return course ? moment(course.date, 'YYYY-MM-DD') : null
}
