import moment from 'moment'
import { s } from 'utils/helper'

export const getCourseSpaceText = course => {
  const availableSpaces = course.spaces - course.orders.length
  return availableSpaces === 0
    ? 'FULL'
    : `${availableSpaces} space${s(availableSpaces)} available`
}

export const getCoursesOnDay = (days, dateStr) => {
  return days
    .filter(day => moment(day.date).format('YYYY-MM-DD') === dateStr)
    .map(day => day.courses)
    .reduce(day => day[0])
}
