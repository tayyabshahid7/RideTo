import { BIKE_HIRE, RIDING_EXPERIENCE, PAYMENT_STATUS } from './constants'

export const BikeHires = [
  { value: BIKE_HIRE.MANUAL, title: 'Manual' },
  { value: BIKE_HIRE.AUTO, title: 'Automatic' },
  { value: BIKE_HIRE.NO, title: 'No' }
]

export function getTitleFor(arr, value) {
  let item = arr.find(itm => itm.value === value)
  if (item) {
    return item.title
  }
  return value
}

export const RidingExperiences = [
  { value: RIDING_EXPERIENCE.CYCLING, title: RIDING_EXPERIENCE.CYCLING },
  {
    value: RIDING_EXPERIENCE.ONROAD_MOTORCYCLING,
    title: RIDING_EXPERIENCE.ONROAD_MOTORCYCLING
  },
  {
    value: RIDING_EXPERIENCE.OFFROAD_MOTORCYCLING,
    title: RIDING_EXPERIENCE.OFFROAD_MOTORCYCLING
  }
]

export const PaymentStatus = [
  { value: PAYMENT_STATUS.RECEIVED, title: 'Received' },
  { value: PAYMENT_STATUS.PAID, title: 'Paid' },
  { value: PAYMENT_STATUS.DENIED, title: 'Denied' }
]

export const Faqs = [
  {
    question: 'Where do I find payment information?',
    answer: 'Here’s an answer we can control on the admin panel..'
  },
  {
    question: 'How do I confirm an order?',
    answer: 'Here’s an answer we can control on the admin panel..'
  },
  {
    question: 'How can I change bikes?',
    answer: 'Here’s an answer we can control on the admin panel..'
  },
  {
    question: 'I have another question!',
    answer: 'Here’s an answer we can control on the admin panel..'
  }
]
