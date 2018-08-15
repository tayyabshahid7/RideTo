import { post } from 'services/api'

export const createStripeToken = async (stripe, name) => {
  return await stripe.createToken({ name })
}

export const createOrder = async data => {
  return await post('orders', data, false)
}

export const getInitialSuppliers = () => {
  return window.RIDE_TO_DATA.widget_locations.filter(
    ({ courses }) => courses.length
  )
}

export const getAddress = loc => {
  return `${loc.address_1}, ${loc.town}, ${loc.postcode}`
}

export const getStartInTime = (now, startTime) => {
  const days = startTime.diff(now, 'days')
  const daysStr = days === 1 ? '1 day, ' : days > 1 ? `${days} days, ` : ''

  const hours = startTime.diff(now, 'hours') % 24.0
  const hoursStr =
    hours === 1 ? '1 hour, ' : hours > 1 ? `${hours} hours, ` : ''

  const minutes = startTime.diff(now, 'minutes') % 60.0
  const minutesStr = `${minutes} minutes`

  return `${daysStr}${hoursStr}${minutesStr}`
}
