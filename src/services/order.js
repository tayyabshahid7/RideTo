import { BIKE_HIRE } from 'common/constants'
import moment from 'moment'
import { get, getXlsx, post, put } from 'services/api'

const DATE_FORMAT = 'YYYY-MM-DD'
const FILTERS = [
  {
    name: 'Today',
    getStartDate: () => moment().format(DATE_FORMAT),
    getEndDate: () => moment().format(DATE_FORMAT)
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

const PAYMENT_STATUS_MAP = {
  PARTIAL_PAYMENT: {
    text: 'Partially Paid',
    type: 'info'
  },
  PAID: {
    text: 'Paid',
    type: 'success'
  },
  OUTSTANDING: {
    text: 'Outstanding',
    type: 'default'
  },
  PENDING: {
    text: 'Outstanding',
    type: 'default'
  }
}

export const getKlarnaFee = async (amount, paymentMethod) => {
  const path = 'payment-intent-fee/'
  const data = {
    amount: amount,
    payment_method: paymentMethod
  }
  const response = await post(path, data)
  return response
}

export const getPaymentStatus = status => {
  const item = PAYMENT_STATUS_MAP[status]
  if (item) {
    return item
  }
  return {
    text: status,
    type: 'default'
  }
}

export const getDateFilters = () => {
  return FILTERS
}

export const fetchSupplierOrders = async (schoolId, params = {}) => {
  const path = `o/${schoolId}/confirmed/`
  const response = await get(path, params)
  return response
}

export const exportOrdersCsv = async (params = {}) => {
  const path = `school/export-order-data`
  const response = await getXlsx(path, params)
  return response
}

export const fetchFilteredOrders = async (params = {}) => {
  const path = 'school/orders'
  const response = await get(path, params)

  return response
}

export const payOrder = async data => {
  const path = 'school/order/payment/'
  const response = await post(path, data)

  return response
}

export const fetchOrderById = async id => {
  const path = `school/order/${id}/`
  const response = await get(path)

  return response
}

export const fetchOrderDetailById = async id => {
  const path = `school/order-detail/${id}/`
  const response = await get(path)

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
  return source === 'RIDETO' || source === 'RT' || source === 'RIDETO_INSTANT'
}

export const isConnectManual = ({ source }) => {
  return source === 'DASHBOARD'
}

export const getCustomerBikeTypeOptions = isFullLicence => {
  if (isFullLicence) {
    return {
      BIKE_TYPE_A1_AUTO: 'A1 Auto Bike',
      BIKE_TYPE_A1_MANUAL: 'A1 Manual Bike',
      BIKE_TYPE_A2_AUTO: 'A2 Auto Bike',
      BIKE_TYPE_A2_MANUAL: 'A2 Manual Bike',
      BIKE_TYPE_A_AUTO: 'A Auto Bike',
      BIKE_TYPE_A_MANUAL: 'A Manual Bike',
      BIKE_HIRE_NONE: 'Own Bike'
    }
  }

  return getBikeHireOptions()
}

export const getBikeHireOptions = isFullLicence => {
  return {
    [BIKE_HIRE.NO]: 'Own Bike',
    [BIKE_HIRE.AUTO]: !isFullLicence ? 'Automatic Scooter' : 'Automatic',
    [BIKE_HIRE.AUTO_50CC]: !isFullLicence
      ? 'Automatic 50cc Scooter'
      : 'Automatic',
    [BIKE_HIRE.AUTO_125CC]: 'Automatic 125cc Scooter',
    [BIKE_HIRE.MANUAL_50CC]: 'Manual 50cc Motorcycle',
    [BIKE_HIRE.MANUAL]: !isFullLicence ? 'Manual 125cc Motorcycle' : 'Manual'
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

export const getTrainingStatusOptions = (isRideTo = false) => {
  if (isRideTo) {
    return [
      { id: 'TRAINING_CONFIRMED', name: 'Confirmed' },
      { id: 'TRAINING_FAILED', name: 'Not completed' },
      { id: 'TRAINING_NO_SHOW', name: 'Not attended' },
      { id: 'TRAINING_PASSED', name: 'Completed' }
    ]
  }

  return [
    { id: 'TRAINING_CONFIRMED', name: 'Confirmed' },
    { id: 'TRAINING_FAILED', name: 'Not completed' },
    { id: 'TRAINING_CANCELLED', name: 'Cancelled' },
    { id: 'TRAINING_NO_SHOW', name: 'Not attended' },
    { id: 'TRAINING_PASSED', name: 'Completed' }
  ]
}

export const getNonCompleteOptions = () => {
  return [
    { id: 'LATE_ATTENDANCE', name: 'Late attendance' },
    { id: 'INCORRECT_DOCUMENT', name: 'Incorrect document' },
    { id: 'EYE_TEST', name: 'Eye test' },
    { id: 'LANGUAGE', name: 'Language' },
    { id: 'HIGHWAY_CODE_KNOWLEDGE', name: 'Highway code knowledge' },
    { id: 'BALANCE_CONTROL', name: 'Balance control' },
    { id: 'ROAD_AWARENESS', name: 'Road awareness' },
    { id: 'OTHER', name: 'Other' }
  ]
}

export const getExpectedPrice = async (
  priceInfo,
  addons = [],
  checkoutData = {},
  paymentType = 'card'
) => {
  const addonsPrice = addons.reduce(
    (total, { discount_price }) => (total += parseFloat(discount_price) * 100),
    0
  )

  const bikeHirePrice = shouldAddBikeHire(checkoutData)
    ? priceInfo.bike_hire_cost
    : 0

  const discountPrice = priceInfo.discount ? priceInfo.discount : 0

  const price =
    priceInfo.priceBeforeFee + addonsPrice + bikeHirePrice - discountPrice

  const { total, fee } = await getKlarnaFee(price, paymentType)

  const result = {
    price: total,
    fee: fee,
    priceBeforeFee: priceInfo.priceBeforeFee
  }
  return result
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
