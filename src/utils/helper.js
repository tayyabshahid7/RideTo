import moment from 'moment'
import {
  DATE_FORMAT,
  WEEK_VIEW_START_TIME_STRING,
  DAY_FORMAT3,
  WEEK_VIEW_START_TIME,
  SINGLE_DAY_IN_SECONDS,
  WORK_HOURS,
  DAY_FORMAT4
} from 'common/constants'

export function s(number) {
  if (number === 1) {
    return ''
  }
  return 's'
}

export function getStarTimeForEventForDate(event, date) {
  let eventDate = moment(new Date(event.start_time)).format(DATE_FORMAT)
  if (eventDate === date) {
    return moment(new Date(event.start_time)).format('HH:mm')
  }
  return WEEK_VIEW_START_TIME_STRING
}

export function secondsForDayAndDurationForEvent(event, date) {
  let baseDate = new Date('2000-01-01 00:00:00')
  let eventDate = moment(new Date(event.start_time)).format(DATE_FORMAT)
  let eventEndDate = moment(new Date(event.end_time)).format(DATE_FORMAT)
  let secondsForDay = WEEK_VIEW_START_TIME
  if (eventDate === date) {
    secondsForDay =
      parseInt(new Date(event.start_time) / 1000 - baseDate / 1000, 10) %
      SINGLE_DAY_IN_SECONDS
  }

  let endTime = WEEK_VIEW_START_TIME + WORK_HOURS * 3600
  if (eventEndDate === date) {
    endTime =
      parseInt(new Date(event.end_time) / 1000 - baseDate / 1000, 10) %
      SINGLE_DAY_IN_SECONDS
  }

  return { secondsForDay, duration: endTime - secondsForDay }
}

export const getTime = dateTime => {
  return dateTime ? moment(dateTime, DAY_FORMAT3).format('HH:mm') : ''
}

export const getTimeFromDateTime = dateTime => {
  return dateTime ? moment(dateTime, DAY_FORMAT4).format('HH:mm') : ''
}

export const generateRandomString = (length = 10) => {
  let text = ''
  let possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  return text
}

export const getAge = birthdate => {
  const age = birthdate
    ? moment().diff(moment(birthdate, 'YYYY-MM-DD'), 'years')
    : '-'

  return age === 1 ? `${age} Year` : `${age} Years`
}
