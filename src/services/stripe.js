import { post } from 'services/api'

const handleServerResponse = async ({
  stripe,
  response,
  full_name,
  email,
  phone
}) => {
  if (response.error) {
    console.log('Error', response.error)
    return { error: response.error }
  } else if (response.requires_action) {
    const { error: errorAction, paymentIntent } = await stripe.handleCardAction(
      response.payment_intent_client_secret
    )

    if (errorAction) {
      console.log('Error', errorAction)
      return { error: response.error }
    } else {
      const serverResponse = await post('payment-intent', {
        payment_intent_id: paymentIntent.id,
        full_name,
        email,
        phone
      })

      handleServerResponse(
        await { stripe, serverResponse, full_name, email, phone }
      )
    }
  } else {
    return { token: { id: response.customer_id } }
  }
}

export const handleStripePayment = async ({
  stripe,
  cardElement,
  full_name,
  email,
  phone
}) => {
  const { paymentMethod, error } = await stripe.createPaymentMethod(
    'card',
    cardElement,
    {
      billing_details: {
        name: full_name,
        email,
        phone
      }
    }
  )

  if (error) {
    console.log('Error', error)
    return { error }
  } else {
    const response = await post('payment-intent', {
      payment_method_id: paymentMethod.id,
      full_name,
      email,
      phone
    })

    handleServerResponse({ stripe, response, full_name, email, phone })
  }
}
