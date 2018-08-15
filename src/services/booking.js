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
