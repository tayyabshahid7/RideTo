import moment from 'moment'

export const checkAllowedDate = date => {
  const requestedDate = moment(date)
  const today = moment()
  const tomorrow = moment(today).add(1, 'days')
  const cutOff = moment(today).set({ hour: 17, minute: 30, second: 0 })
  const isAfterCutOff = today.isAfter(cutOff)
  const isRequestedDateInThePast = requestedDate.isBefore(today)
  const isRequestedDateToday = requestedDate.isSame(today, 'day')
  const isRequestedDateTomorrow = requestedDate.isSame(tomorrow, 'day')

  if (isRequestedDateInThePast || isRequestedDateToday) {
    return false
  }

  if (isRequestedDateTomorrow && isAfterCutOff) {
    return false
  }

  return true
}
