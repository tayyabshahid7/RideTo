import { BIKE_HIRE, RIDING_EXPERIENCE } from './constants'

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

export const Faqs = [
  {
    question: 'Where do I find payment information?',
    answer: 'Payment information is still all stored in your Stripe account.'
  },
  {
    question: 'How do I confirm an order?',
    answer:
      'Any outstanding orders will appear under pending orders on this page. Just click respond.'
  },
  {
    question: 'How can I change bikes?',
    answer: 'On the calendar, click create course and complete the fields.'
  },
  {
    question: 'I have another question!',
    answer: 'Email james@rideto.com'
  }
]
