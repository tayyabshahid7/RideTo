import {
  BIKE_HIRE,
  DATE_FORMAT,
  RIDER_TYPE,
  RIDING_EXPERIENCE,
  SORTBY
} from './constants'

import moment from 'moment'

export const BikeHires = [
  { value: BIKE_HIRE.NO, title: 'Own Bike' },
  { value: BIKE_HIRE.AUTO, title: 'Automatic' },
  { value: BIKE_HIRE.AUTO_50CC, title: 'Automatic 50cc' },
  { value: BIKE_HIRE.AUTO_ELECTRIC, title: 'Automatic Electric' },
  { value: BIKE_HIRE.AUTO_125CC, title: 'Automatic 125cc' },
  { value: BIKE_HIRE.MANUAL, title: 'Manual 125cc' },
  { value: BIKE_HIRE.MANUAL_50CC, title: 'Manual 50cc' },
  { value: BIKE_HIRE.BIKE_TYPE_A_MANUAL, title: 'A Manual Bike' },
  { value: BIKE_HIRE.BIKE_TYPE_A1_MANUAL, title: 'A1 Manual Bike' },
  { value: BIKE_HIRE.BIKE_TYPE_A2_MANUAL, title: 'A2 Manual Bike' },
  { value: BIKE_HIRE.BIKE_TYPE_A_AUTO, title: 'A Auto Bike' },
  { value: BIKE_HIRE.BIKE_TYPE_A1_AUTO, title: 'A1 Auto Bike' },
  { value: BIKE_HIRE.BIKE_TYPE_A2_AUTO, title: 'A2 Auto Bike' }
]

export function getFullLicenseBikeHires(course, prevBikeType) {
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
      value:
        prevBikeType === 'BIKE_TYPE_A1_AUTO' || a1_auto_bikes
          ? 'BIKE_TYPE_A1_AUTO'
          : null,
      title: 'A1 Auto Bike'
    },
    {
      value:
        prevBikeType === 'BIKE_TYPE_A1_MANUAL' || a1_manual_bikes
          ? 'BIKE_TYPE_A1_MANUAL'
          : null,
      title: 'A1 Manual Bike'
    },
    {
      value:
        prevBikeType === 'BIKE_TYPE_A2_AUTO' || a2_auto_bikes
          ? 'BIKE_TYPE_A2_AUTO'
          : null,
      title: 'A2 Auto Bike'
    },
    {
      value:
        prevBikeType === 'BIKE_TYPE_A2_MANUAL' || a2_manual_bikes
          ? 'BIKE_TYPE_A2_MANUAL'
          : null,
      title: 'A2 Manual Bike'
    },
    {
      value:
        prevBikeType === 'BIKE_TYPE_A_AUTO' || a_auto_bikes
          ? 'BIKE_TYPE_A_AUTO'
          : null,
      title: 'A Auto Bike'
    },
    {
      value:
        prevBikeType === 'BIKE_TYPE_A_MANUAL' || a_manual_bikes
          ? 'BIKE_TYPE_A_MANUAL'
          : null,
      title: 'A Manual Bike'
    },
    {
      value: 'BIKE_HIRE_NONE',
      title: 'Own Bike'
    }
  ]
}

export function getAvailableBikeHires(course, prevBikeType) {
  if (!course) {
    return []
  }

  const courseType =
    typeof course.course_type === 'object'
      ? course.course_type.constant
      : course.course_type

  if (courseType.startsWith('FULL_LICENCE')) {
    return getFullLicenseBikeHires(course, prevBikeType)
  }

  const {
    auto_125cc_bikes,
    auto_125cc_count,

    auto_bikes,
    auto_count,

    auto_50cc_bikes,
    auto_50cc_count,

    auto_electric_bikes,
    auto_electric_count,

    manual_50cc_bikes,
    manual_50cc_count,

    manual_bikes,
    manual_count
  } = course

  return [
    // {
    //   value:
    //     prevBikeType === 'BIKE_TYPE_MANUAL' || manual_bikes > manual_count
    //       ? 'BIKE_TYPE_MANUAL'
    //       : null,
    //   title: 'Manual'
    // },
    // TODO: refer to the above logic
    {
      value:
        auto_bikes > auto_count || prevBikeType === BIKE_HIRE.AUTO
          ? BIKE_HIRE.AUTO
          : null,
      title: 'Automatic Scooter'
    },
    {
      value:
        auto_125cc_bikes > auto_125cc_count ||
        prevBikeType === BIKE_HIRE.AUTO_125CC
          ? BIKE_HIRE.AUTO_125CC
          : null,
      title: 'Automatic 125cc Scooter'
    },
    {
      value:
        auto_electric_bikes > auto_electric_count ||
        prevBikeType === BIKE_HIRE.AUTO_ELECTRIC
          ? BIKE_HIRE.AUTO_ELECTRIC
          : null,
      title: 'Automatic Electric Scooter'
    },

    {
      value:
        auto_50cc_bikes > auto_50cc_count ||
        prevBikeType === BIKE_HIRE.AUTO_50CC
          ? BIKE_HIRE.AUTO_50CC
          : null,
      title: 'Automatic 50cc Scooter'
    },
    {
      value:
        manual_50cc_bikes > manual_50cc_count ||
        prevBikeType === BIKE_HIRE.MANUAL_50CC
          ? BIKE_HIRE.MANUAL_50CC
          : null,
      title: 'Manual 50cc Motorcycle'
    },
    {
      value:
        manual_bikes > manual_count || prevBikeType === BIKE_HIRE.MANUAL
          ? BIKE_HIRE.MANUAL
          : null,
      title: 'Manual 125cc Motorcycle'
    },
    // {
    //   value:
    //     prevBikeType === 'BIKE_TYPE_AUTO' || auto_bikes > auto_count
    //       ? 'BIKE_TYPE_AUTO'
    //       : null,
    //   title: 'Automatic Scooter'
    // },
    { value: BIKE_HIRE.NO, title: 'Own Bike' }
  ]
}

export function getFullLicenseType(value) {
  let types = value.toUpperCase().split('_')
  const validTypes = ['A', 'A1', 'A2']
  if (validTypes.includes(types[2])) {
    return 'FULL_LICENCE_TYPE_' + types[2]
  }
  return 'FULL_LICENCE_TYPE_NONE'
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

export function getTestResultOptions() {
  return [
    {
      id: null,
      name: ''
    },
    {
      id: 'TEST_RESULT_PASSED',
      name: 'Passed'
    },
    {
      id: 'TEST_RESULT_FAILED',
      name: 'Failed'
    }
  ]
}

export function formatBikeConstant(constant) {
  switch (constant) {
    case 'BIKE_TYPE_AUTO':
    case 'auto':
    case 'Auto':
    case 'automatic':
    case 'Automatic':
      return BIKE_HIRE.AUTO
    case 'AUTO_50CC':
    case 'auto_50cc':
    case 'BIKE_TYPE_AUTO_50CC':
      return BIKE_HIRE.AUTO_50CC
    case 'BIKE_TYPE_AUTO_ELECTRIC':
      return BIKE_HIRE.AUTO_ELECTRIC
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
      return BIKE_HIRE.NO
    case 'BIKE_TYPE_A_MANUAL':
      return BIKE_HIRE.BIKE_TYPE_A_MANUAL
    case 'BIKE_TYPE_A1_MANUAL':
      return BIKE_HIRE.BIKE_TYPE_A1_MANUAL
    case 'BIKE_TYPE_A2_MANUAL':
      return BIKE_HIRE.BIKE_TYPE_A2_MANUAL
    case 'BIKE_TYPE_A_AUTO':
      return BIKE_HIRE.BIKE_TYPE_A_AUTO
    case 'BIKE_TYPE_A1_AUTO':
      return BIKE_HIRE.BIKE_TYPE_A1_AUTO
    case 'BIKE_TYPE_A2_AUTO':
      return BIKE_HIRE.BIKE_TYPE_A2_AUTO
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
      'You can read more information in our <a href="https://docs.google.com/document/d/1DJD4RzjNr59P60FcShXNiIBl34Y3NcOgUdCWRUoG9b4/" target="_blank">guidebook</a> and watch the <a href="https://youtu.be/iYLoRPZTvlk" target="_blank">demo video</a> online. Alternatively email <a href="mailto:hello@rideto.com">hello@rideto.com</a>'
  }
]

export const SortByOptions = [
  { value: SORTBY.DISTANCE, title: 'Sort by Distance' },
  { value: SORTBY.NEXT_AVAILABLE_DATE_UP, title: 'Sort by Date' },
  { value: SORTBY.PRICE_DOWN_UP, title: 'Sort by Price' },
  // { value: SORTBY.PRICE_UP_DOWN, title: 'Sort by Price Desc' },
  { value: SORTBY.RATING, title: 'Sort by Rating' }
]

export const Features = [
  {
    value: 'mciac_approved',
    icon: 'Approved',
    title: 'MCIA Approved',
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
    title: 'On-Site Cafe',
    description: null
  },
  {
    value: 'on_site_parking',
    icon: 'Parking',
    title: 'On-Site Parking',
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

export function getDateRangeByType(type) {
  let fromDate = null
  let toDate = null
  switch (type.toLowerCase()) {
    case 'today': {
      fromDate = moment()
      toDate = moment()
      break
    }
    case 'all': {
      break
    }
    case 'this week': {
      fromDate = moment().startOf('isoWeek')
      toDate = moment().endOf('isoWeek')
      break
    }
    case 'this month': {
      fromDate = moment().startOf('month')
      toDate = moment().endOf('month')
      break
    }
    case 'this year': {
      fromDate = moment().startOf('year')
      toDate = moment().endOf('year')
      break
    }
    default: {
      fromDate = moment()
      toDate = moment()
      break
    }
  }

  if (fromDate) {
    fromDate = fromDate.format('YYYY-MM-DD')
  }
  if (toDate) {
    toDate = toDate.format('YYYY-MM-DD')
  }

  return { fromDate, toDate }
}
