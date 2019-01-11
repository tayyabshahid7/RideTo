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
  { value: SORTBY.PRICE_DOWN_UP, title: 'Sort by Price' },
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
    description: null
  },
  {
    value: 'helmet_hire',
    icon: 'Helmet',
    title: 'Helmet & Gloves Provided',
    description: null
  },
  {
    value: 'on_site_cafe',
    icon: 'Cafe',
    title: 'On Site Cafe',
    description: null
  },
  {
    value: 'indoor_classroom',
    icon: 'Class',
    title: 'Indoor Classroom',
    description: null
  },
  {
    value: 'instant_book',
    icon: 'Instant',
    title: 'Instant Booking',
    description:
      'This site has instant booking, so your order will be booked on checkout. Non-instant sites require confirmation from the instructor.'
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

export function getPackageDays(days) {
  let dates = [
    {
      id: 'module1Training1',
      type: 'FULL_LICENCE_MOD1_TRAINING',
      title: 'Module 1 Training',
      course_id: null,
      date: '',
      time: ''
    },
    {
      id: 'module1Test',
      type: 'FULL_LICENCE_MOD1_TEST',
      title: 'Module 1 Test',
      course_id: null,
      date: '',
      time: ''
    },
    {
      id: 'module2Training1',
      type: 'FULL_LICENCE_MOD2_TRAINING',
      title: 'Module 2 Training',
      course_id: null,
      date: '',
      time: ''
    },
    {
      id: 'module2Test',
      type: 'FULL_LICENCE_MOD2_TEST',
      title: 'Module 2 Test',
      course_id: null,
      date: '',
      time: ''
    }
  ]

  if (days === '5') {
    dates = [
      {
        id: 'module1Training1',
        type: 'FULL_LICENCE_MOD1_TRAINING',
        title: 'Module 1 Training',
        course_id: null,
        date: '',
        time: ''
      },
      {
        id: 'module1Test',
        type: 'FULL_LICENCE_MOD1_TEST',
        title: 'Module 1 Test',
        course_id: null,
        date: '',
        time: ''
      },
      {
        id: 'module2Training1',
        type: 'FULL_LICENCE_MOD2_TRAINING',
        title: 'Module 2 Training',
        course_id: null,
        date: '',
        time: ''
      },
      {
        id: 'module2Training2',
        type: 'FULL_LICENCE_MOD2_TRAINING',
        title: 'Module 2 Training',
        course_id: null,
        date: '',
        time: ''
      },
      {
        id: 'module2Test',
        type: 'FULL_LICENCE_MOD2_TEST',
        title: 'Module 2 Test',
        course_id: null,
        date: '',
        time: ''
      }
    ]
  }

  if (days === '6') {
    dates = [
      {
        id: 'module1Training1',
        type: 'FULL_LICENCE_MOD1_TRAINING',
        title: 'Module 1 Training',
        course_id: null,
        date: '',
        time: ''
      },
      {
        id: 'module1Training2',
        type: 'FULL_LICENCE_MOD1_TRAINING',
        title: 'Module 1 Training',
        course_id: null,
        date: '',
        time: ''
      },
      {
        id: 'module1Test',
        type: 'FULL_LICENCE_MOD1_TEST',
        title: 'Module 1 Test',
        course_id: null,
        date: '',
        time: ''
      },
      {
        id: 'module2Training1',
        type: 'FULL_LICENCE_MOD2_TRAINING',
        title: 'Module 2 Training',
        course_id: null,
        date: '',
        time: ''
      },
      {
        id: 'module2Training2',
        type: 'FULL_LICENCE_MOD2_TRAINING',
        title: 'Module 2 Training',
        course_id: null,
        date: '',
        time: ''
      },
      {
        id: 'module2Test',
        type: 'FULL_LICENCE_MOD2_TEST',
        title: 'Module 2 Test',
        course_id: null,
        date: '',
        time: ''
      }
    ]
  }

  return dates
}
