import moment from 'moment'
import {
  BIKE_HIRE,
  RIDING_EXPERIENCE,
  SORTBY,
  RIDER_TYPE,
  DATE_FORMAT
} from './constants'

export const BikeHires = [
  { value: BIKE_HIRE.MANUAL, title: 'Manual' },
  { value: BIKE_HIRE.AUTO, title: 'Automatic' },
  { value: BIKE_HIRE.NO, title: 'No' },
  { value: BIKE_HIRE.MANUAL_50CC, title: 'Manual 50cc' },
  { value: BIKE_HIRE.AUTO_125CC, title: 'Automatic 125cc' }
]

export function getFullLicenseBikeHires(course) {
  const {
    a1_auto_bikes,
    a1_manual_bikes,
    a2_auto_bikes,
    a2_manual_bikes,
    a_auto_bikes,
    a_manual_bikes
  } = course

  return [
    {
      value: a1_auto_bikes ? 'a1_' + BIKE_HIRE.AUTO : null,
      title: 'A1 Auto Bike'
    },
    {
      value: a1_manual_bikes ? 'a1_' + BIKE_HIRE.MANUAL : null,
      title: 'A1 Manual Bike'
    },
    {
      value: a2_auto_bikes ? 'a2_' + BIKE_HIRE.AUTO : null,
      title: 'A2 Auto Bike'
    },
    {
      value: a2_manual_bikes ? 'a2_' + BIKE_HIRE.MANUAL : null,
      title: 'A2 Manual Bike'
    },
    {
      value: a_auto_bikes ? 'a_' + BIKE_HIRE.AUTO : null,
      title: 'A Auto Bike'
    },
    {
      value: a_manual_bikes ? 'a_' + BIKE_HIRE.MANUAL : null,
      title: 'A Manual Bike'
    },
    {
      value: BIKE_HIRE.NO,
      title: 'Own Bike'
    }
  ]
}

export function getAvailableBikeHires(course) {
  if (!course) {
    return []
  }

  if (course.course_type.constant.startsWith('FULL_LICENCE')) {
    return getFullLicenseBikeHires(course)
  }

  const {
    // auto_125cc_bikes,
    auto_bikes,
    auto_count,
    // manual_50cc_bikes,
    manual_bikes,
    manual_count
  } = course

  return [
    // {
    //   value: manual_50cc_bikes ? BIKE_HIRE.MANUAL_50CC : null,
    //   title: 'Manual 50cc'
    // },
    {
      value: manual_bikes > manual_count ? BIKE_HIRE.MANUAL : null,
      title: 'Manual 125cc'
    },
    {
      value: auto_bikes > auto_count ? BIKE_HIRE.AUTO : null,
      title: 'Automatic Scooter'
    },
    // {
    //   value: auto_125cc_bikes ? BIKE_HIRE.AUTO_125CC : null,
    //   title: 'Automatic 125cc'
    // },
    { value: BIKE_HIRE.NO, title: 'Own Bike' }
  ]
}

export function getLicenseFromType(value) {
  let [type] = value.toUpperCase().split('_')
  if (value === BIKE_HIRE.NO) {
    type = 'NONE'
  }
  return 'FULL_LICENCE_TYPE_' + type
}

export function getTimeValue(time) {
  try {
    const times = time.split(':').map(x => parseInt(x))
    if (times.length < 2) {
      return 0
    }
    return times[0] * 60 + times[1]
  } catch (err) {
    return 0
  }
}

export function formaBikeTypeForEdit(order) {
  if (order.full_licence_type.startsWith('FULL_LICENCE_TYPE')) {
    const type = formatBikeConstant(order.bike_type)
    if (type !== BIKE_HIRE.NO) {
      let tmp = order.full_licence_type.split('_')
      tmp = tmp[tmp.length - 1].toLowerCase()
      return `${tmp}_${type}`
    }
    return type
  } else {
    return formatBikeConstant(order.bike_hire)
  }
}

export function formatBikeConstant(constant) {
  switch (constant) {
    case 'BIKE_TYPE_AUTO':
    case 'auto':
    case 'Auto':
    case 'automatic':
    case 'Automatic':
      return BIKE_HIRE.AUTO
    case 'AUTO_125CC':
    case 'BIKE_TYPE_AUTO_125CC':
    case 'BIKE_TYPE_BIKE_125CC':
      return BIKE_HIRE.AUTO_125CC
    case 'BIKE_TYPE_MANUAL':
    case 'manual':
    case 'Manual':
      return BIKE_HIRE.MANUAL
    case 'MANUAL_50CC':
    case 'BIKE_TYPE_MANUAL_50CC':
      return BIKE_HIRE.MANUAL_50CC
    case 'BIKE_TYPE_NONE':
    case 'none':
    case 'no':
    default:
      return BIKE_HIRE.NO
  }
}

export const FullLicenceTypes = [
  { value: 'FULL_LICENCE_TYPE_A1', title: 'A1' },
  { value: 'FULL_LICENCE_TYPE_A2', title: 'A2' },
  { value: 'FULL_LICENCE_TYPE_A', title: 'A' },
  { value: 'FULL_LICENCE_TYPE_NONE', title: 'None' }
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
    answer:
      'You can read more information in our <a href="https://docs.google.com/document/d/1DJD4RzjNr59P60FcShXNiIBl34Y3NcOgUdCWRUoG9b4/" target="_blank">guidebook</a> and watch the <a href="https://youtu.be/iYLoRPZTvlk" target="_blank">demo video</a> online. Alternatively email <a href="mailto:vince@rideto.com">vince@rideto.com</a>'
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
    title: 'MCIA APPROVED',
    description:
      'By choosing an MCIA RIDE approved training school you can be sure that the standards of training and customer service you receive will be amongst the best on offer.'
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
    title: 'Helmet Provided',
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
  },
  {
    value: 'gloves_jacket_included',
    icon: 'Gloves',
    title: 'Gloves & Jacket Provided',
    description: null
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

  if (days >= '5') {
    dates = [
      ...dates.slice(0, 3),
      {
        id: 'module2Training2',
        type: 'FULL_LICENCE_MOD2_TRAINING',
        title: 'Module 2 Training',
        course_id: null,
        date: '',
        time: ''
      },
      ...dates.slice(3)
    ]
  }

  if (days >= '6') {
    dates = [
      ...dates.slice(0, 1),
      {
        id: 'module1Training2',
        type: 'FULL_LICENCE_MOD1_TRAINING',
        title: 'Module 1 Training',
        course_id: null,
        date: '',
        time: ''
      },
      ...dates.slice(1)
    ]
  }

  return dates
}

export function getPackageStartDate(date, index, selectedPackageDates) {
  let start_date

  if (!selectedPackageDates[index - 1]) {
    start_date = moment().format(DATE_FORMAT)
  } else if (selectedPackageDates[index - 1].date === '') {
    start_date = null
  } else {
    start_date = moment(selectedPackageDates[index - 1].date)
      .add(1, 'days')
      .format(DATE_FORMAT)
  }

  if (date.type === 'FULL_LICENCE_MOD2_TEST') {
    const dateTest1 = selectedPackageDates.find(
      selectedDate => selectedDate.type === 'FULL_LICENCE_MOD1_TEST'
    ).date

    if (dateTest1) {
      const afterDateTest1 = moment(dateTest1)
        .add(12, 'days')
        .format(DATE_FORMAT)

      if (afterDateTest1 > start_date) {
        start_date = afterDateTest1
      }
    }
  }

  return start_date
}

export function isAllPackageDatesSelected(selectedPackageDates) {
  const packageSelected = selectedPackageDates.length
  const allDatesSelected = selectedPackageDates.every(date => {
    return date.date !== ''
  })

  return !!packageSelected && allDatesSelected
}

export function isAnyPackageDatesSelected(selectedPackageDates) {
  return selectedPackageDates.some(date => date.date !== '')
}
