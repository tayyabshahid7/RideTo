import { get, post } from 'services/api'

export const fetchEmails = async customerId => {
  const path = 'email/'
  const params = { customer: customerId }

  // TODO DELETE THIS
  return [
    {
      title: `Your CBT Course ${customerId}is Confirmed!`,
      id: 123,
      date: 'Feb 19',
      time: '14:29',
      body:
        'joaijsdofi jasdofij asdpofkj aspofkja sdofkjas dfokasdj fokasd fjoaskd fjasokd fj asdfjaoisfa sdfoiajs dfoasifjaspofijasdfi'
    },
    {
      title: 'YourTESTe is Confirmed!',
      id: 124,
      date: 'Feb 19',
      time: '14:29',
      body:
        'joaijsdofi jasdofij asdpofkj aspofkja sdofkjas dfokasdj fokasd fjoaskd fjasokd fj asdfjaoisfa sdfoiajs dfoasifjaspofijasdfi'
    },
    {
      title: 'YourTE234234234234!',
      id: 12224,
      date: 'Feb 19',
      time: '14:29',
      body:
        'joaijsdofi jasdofij asdpofkj aspofkja sdofkjas dfokasdj fokasd fjoaskd fjasokd fj asdfjaoisfa sdfoiajs dfoasifjaspofijasdfi'
    }
  ]

  const response = await get(path, params)

  return response
}

export const fireEmail = async email => {
  const path = 'email/send'
  const params = { email }

  const response = await post(path, params)

  return response
}
