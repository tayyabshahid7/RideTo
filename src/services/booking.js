import { post } from 'services/api'

export const createStripeToken = async (stripe, name) => {
  return await stripe.createToken({ name })
}

export const createOrder = async data => {
  return await post('orders', data, false)
}
