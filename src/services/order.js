import moment from 'moment'
import { get, put, post } from 'services/api'

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

export const fetchSchoolOrders = async (schoolId, params = {}) => {
  const path = `o/${schoolId}/confirmed/`
  const response = await get(path, params)

  return response
}

export const fetchOrders = async (params = {}) => {
  const path = 'o/'
  const response = await get(path, params)

  return response
}

export const saveOrder = async order => {
  const { id } = order
  const path = id ? `o/${id}` : `o/`
  const method = id ? put : post

  return await method(path, order)
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
      id: 'received',
      name: 'Received'
    },
    {
      id: 'paid',
      name: 'Paid'
    },
    {
      id: 'denied',
      name: 'Denied'
    },
    {
      id: 'pending',
      name: 'Pending'
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
