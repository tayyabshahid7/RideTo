import moment from 'moment'
import {
  DATE_FORMAT,
  WEEK_VIEW_START_TIME_STRING,
  WEEK_VIEW_START_TIME,
  SINGLE_DAY_IN_SECONDS,
  WORK_HOURS
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
