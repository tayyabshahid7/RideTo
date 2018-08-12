export const createBooking = async (path, params) => {}

export const createStripeToken = async (stripe, name) => {
  const response = await stripe.createToken({ name })
  console.log(response)
}
