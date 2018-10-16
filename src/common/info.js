import { BIKE_HIRE, RIDING_EXPERIENCE, SORTBY, RIDER_TYPE } from './constants'

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

export const SortByOptions = [
  { value: SORTBY.DISTANCE, title: 'Sort by Distance' },
  { value: SORTBY.PRICE_DOWN_UP, title: 'Sort by Price Asc' },
  // { value: SORTBY.PRICE_UP_DOWN, title: 'Sort by Price Desc' },
  { value: SORTBY.RATING, title: 'Sort by Rating' }
]

export const Features = [
  {
    value: 'mciac_approved',
    icon: 'Approved',
    title: 'MCIAC APPROVED',
    description:
      'By choosing an MCIAC accredited training school you can be sure that the standards of training and customer service you receive will be amongst the best on offer.'
  },
  {
    value: 'bike_hire',
    icon: 'Bike',
    title: 'Bike Hire Included',
    description: 'Bike Hire description'
  },
  {
    value: 'helmet_hire',
    icon: 'Helmet',
    title: 'Helmet & Gloves Provided',
    description: 'Helemt hire description.'
  },
  {
    value: 'on_site_cafe',
    icon: 'Cafe',
    title: 'On Site Cafe',
    description: 'Onsite Cafe Description'
  },
  {
    value: 'indoor_classroom',
    icon: 'Class',
    title: 'Indoor Classroom',
    description: 'Indoor classroom description.'
  },
  {
    value: 'instant_book',
    icon: 'Instant',
    title: 'Instant Booking',
    description:
      "This site has an instant booking, so you're order will be instantly confirmed. Non-instant book sites require confirmation from the instructor first."
  }
]

export const RiderTypes = [
  {
    value: RIDER_TYPE.SOCIAL,
    title: 'Social'
  },
  {
    value: RIDER_TYPE.CAREER,
    title: 'Delivery Work'
  },
  {
    value: RIDER_TYPE.COMMUTER,
    title: 'Commuting'
  }
]
