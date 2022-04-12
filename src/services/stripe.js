import { post, put, get } from 'services/api'

const handleServerResponse = async ({
  stripe,
  response,
  setup_id,
  full_name,
  email,
  phone
}) => {
  if (response.error) {
    console.log('response.error', response.error)
    return { error: response.error }
  } else if (response.requires_action) {
    const { error: errorAction } = await stripe.handleCardAction(
      response.payment_intent_client_secret
    )

    if (errorAction) {
      console.log('errorAction', errorAction)
      return { error: errorAction }
    } else {
      const serverResponse = await post(
        'payment-intent/',
        {
          setup_id
        },
        false
      )

      return await handleServerResponse({
        stripe,
        response: serverResponse,
        full_name,
        email,
        phone
      })
    }
  } else {
    const { customer_id } = await post(
      'create-customer-id/',
      {
        setup_id,
        name: full_name,
        email,
        phone
      },
      false
    )

    return { token: { id: customer_id } }
  }
}

export const getPaymentIntentSecretClient = async intent => {
  const { amount, client_secret, id } = await get(
    'get-payment-intent/',
    { intent: intent },
    false
  )
  return { amount, client_secret, id }
}

export const updatePaymentIntentSecretClient = async (amount, intent) => {
  const { client_secret } = await put(
    'update-payment-intent/',
    { amount: amount, intent: intent },
    false
  )
  return client_secret
}

export const createPaymentIntentSecretClient = async price => {
  const { client_secret, id } = await post(
    'create-payment-intent/',
    { amount: price },
    false
  )
  return { client_secret, id }
}

export const handleStripePayment = async ({
  stripe,
  cardElement,
  full_name,
  email,
  phone
}) => {
  const { client_secret } = await post('get-intent/', {}, false)

  const { setupIntent, error } = await stripe.handleCardSetup(
    client_secret,
    cardElement,
    {
      payment_method_data: {
        billing_details: {
          name: full_name,
          email,
          phone
        }
      }
    }
  )

  if (error) {
    console.log('error', error)
    return { error }
  } else {
    const setup_id = setupIntent.id
    const response = await post(
      'payment-intent/',
      {
        setup_id
      },
      false
    )

    return await handleServerResponse({
      stripe,
      response,
      setup_id,
      full_name,
      email,
      phone
    })
  }
}
