import { get } from 'services/api'

export const fetchEmails = async customerId => {
  const path = 'email/'
  const params = { customer: customerId }

  // TODO DELETE THIS
  return [
    {
      title: `Your CBT Course ${customerId}is Confirmed!`,
      id: 123,
      date: 'Feb 19',
      time: '14:29'
    },
    {
      title: 'YourTESTe is Confirmed!',
      id: 124,
      date: 'Feb 19',
      time: '14:29'
    },
    {
      title: 'YourTE234234234234!',
      id: 12224,
      date: 'Feb 19',
      time: '14:29'
    }
  ]

  const response = await get(path, params)

  return response
}
