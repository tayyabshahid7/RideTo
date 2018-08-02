import moment from 'moment'
import { get } from 'services/api'

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
        .startOf('week')
        .format(DATE_FORMAT),
    getEndDate: () =>
      moment()
        .endOf('week')
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
