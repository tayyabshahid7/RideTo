import moment from 'moment'
import { get, put, post } from 'services/api'
import { BIKE_HIRE } from 'common/constants'

const DATE_FORMAT = 'YYYY-MM-DD'
const FILTERS = [
  {
    name: 'Today',
    getStartDate: () => moment().format(DATE_FORMAT),
    getEndDate: () =>
      moment()
        .add(1, 'day')
        .format(DATE_FORMAT)
  },
  {
    name: 'This Week',
    getStartDate: () =>
      moment()
        .startOf('isoWeek')
        .format(DATE_FORMAT),
    getEndDate: () =>
      moment()
        .endOf('isoWeek')
        .format(DATE_FORMAT)
  },
  {
    name: 'This Month',
    getStartDate: () =>
      moment()
        .startOf('month')
        .format(DATE_FORMAT),
    getEndDate: () =>
      moment()
        .endOf('month')
        .format(DATE_FORMAT)
  },
  {
    name: 'All',
    getStartDate: () => null,
    getEndDate: () => null
  }
]

export const getDateFilters = () => {
  return FILTERS
}

export const fetchSupplierOrders = async (schoolId, params = {}) => {
  const path = `o/${schoolId}/confirmed/`
  const response = await get(path, params)
  return response
}

export const fetchOrders = async (params = {}) => {
  const path = 'o/'
  const response = await get(path, params)

  return response
}

export const sendConfirmation = async orderFriendlyId => {
  const path = `o/${orderFriendlyId}/send_confirmation`
  const response = await post(path)

  return response
}

export const saveTraining = async training => {
  const { id } = training
  const path = id ? `o/${id}` : `o/`
  const method = id ? put : post

  return await method(path, training)
}

export const isRideTo = ({ source }) => {
  return source === 'RIDETO' || source === 'RIDETO_INSTANT'
}

export const isConnectManual = ({ source }) => {
  return source === 'DASHBOARD'
}

export const getBikeHireOptions = isFullLicence => {
  return {
    no: 'Own Bike',
    auto: 'Automatic Scooter',
    manual: !isFullLicence ? 'Manual 125cc Motorcycle' : 'Manual Motorcycle'
  }
}

export const getPaymentOptions = () => {
  return [
    {
      id: 'PAID',
      name: 'Paid'
    },
    {
      id: 'PENDING',
      name: 'Payment Outstanding'
    },
    {
      id: 'PARTIAL_PAYMENT',
      name: 'Partially paid'
    }
  ]
}

export const getTrainingStatusOptions = () => {
  return [
    { id: 'TRAINING_CONFIRMED', name: 'Confirmed' },
    { id: 'TRAINING_FAILED', name: 'Not completed' },
    { id: 'TRAINING_CANCELLED', name: 'Cancelled' },
    // {
    //   id: 'TRAINING_WAITING_SCHOOL_CONFIRMATION',
    //   name: 'Waiting for school confirmation'
    // },
    // {
    //   id: 'TRAINING_WAITING_RIDER_CONFIRMATION',
    //   name: 'Waiting for rider confirmation'
    // },
    { id: 'TRAINING_NO_SHOW', name: 'Not attended' },
    { id: 'TRAINING_PASSED', name: 'Completed' }
  ]
}

export const getExpectedPrice = (priceInfo, addons = [], checkoutData = {}) => {
  return (
    priceInfo.price +
    addons.reduce((total, { price }) => (total += price * 100), 0) +
    (shouldAddBikeHire(checkoutData) ? priceInfo.bike_hire_cost : 0)
  )
}

export const shouldAddBikeHire = ({ courseType, bike_hire }) => {
  if (courseType === 'LICENCE_CBT_RENEWAL' && bike_hire !== BIKE_HIRE.NO) {
    return true
  }
  return false
}

export const showReview = order => {
  return (
    order.training_status === 'COMPLETED' &&
    order.supplierrating_set &&
    order.supplierrating_set.length === 0
  )
}

export const getBikeHireDetail = bike_hire => {
  if (bike_hire === 'no') {
    return 'Own bike, helmet and gloves required'
  } else if (bike_hire === 'auto') {
    return `Automatic scooter, helmet & gloves provided`
  } else if (bike_hire === 'manual') {
    return 'Manual motorcycle, helmet & gloves provided'
  } else return ''
}
