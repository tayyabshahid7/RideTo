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

export const sendConfirmation = async order => {
  const path = `o/${order.id}/send_confirmation`
  const response = await post(path)

  return response
}

export const saveOrder = async order => {
  const { id } = order
  const path = id ? `o/${id}` : `o/`
  const method = id ? put : post

  return await method(path, order)
}

export const isRideTo = ({ source }) => {
  return source === 'RIDETO'
}

export const getBikeHireOptions = () => {
  return {
    no: 'Own Bike',
    auto: 'Automatic Bike Hire',
    manual: 'Manual Bike Hire'
  }
}

export const getPaymentOptions = () => {
  return [
    {
      id: 'paid',
      name: 'Paid'
    },
    {
      id: 'pending',
      name: 'Payment Outstanding'
    }
  ]
}

export const getTrainingStatusOptions = () => {
  return [
    {
      id: 'NON_START',
      name: 'Non-start'
    },
    {
      id: 'NON_COMPLETION',
      name: 'Non-completion'
    },
    {
      id: 'COMPLETED',
      name: 'Completed'
    }
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
