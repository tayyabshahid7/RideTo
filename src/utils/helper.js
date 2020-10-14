import moment from 'moment'
import _ from 'lodash'
import {
  DATE_FORMAT,
  WEEK_VIEW_START_TIME_STRING,
  DAY_FORMAT3,
  WEEK_VIEW_START_TIME,
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

export function formatShiftTime(event, date) {
  let eventDate = moment(new Date(event.start_time)).format(DATE_FORMAT)
  if (eventDate === date) {
    return (
      moment(new Date(event.start_time)).format('HH:mm') +
      ' - ' +
      moment(new Date(event.end_time)).format('HH:mm')
    )
  }
  return WEEK_VIEW_START_TIME_STRING
}

export function getTimeOfDayInSeconds(time) {
  return moment(time).diff(moment(time).startOf('day'), 'seconds')
}

export function getUtcTimeInSeconds(time) {
  const tmp = moment.utc(time)
  return tmp.diff(moment(tmp).startOf('day'), 'seconds')
}

export function secondsForDayAndDurationForEvent(
  event,
  fullDate,
  isUtc = true
) {
  let date = moment(new Date(fullDate)).format(DATE_FORMAT)
  let eventDate, eventEndDate
  if (isUtc) {
    eventDate = moment.utc(new Date(event.start_time)).format(DATE_FORMAT)
    eventEndDate = moment.utc(new Date(event.end_time)).format(DATE_FORMAT)
  } else {
    eventDate = moment(new Date(event.start_time)).format(DATE_FORMAT)
    eventEndDate = moment(new Date(event.end_time)).format(DATE_FORMAT)
  }
  let secondsForDay = WEEK_VIEW_START_TIME
  if (eventDate === date) {
    if (isUtc) {
      secondsForDay = getUtcTimeInSeconds(event.start_time)
    } else {
      secondsForDay = getTimeOfDayInSeconds(event.start_time)
    }
  }

  let endTime = WEEK_VIEW_START_TIME + WORK_HOURS * 3600
  if (eventEndDate === date) {
    if (isUtc) {
      endTime = getUtcTimeInSeconds(event.end_time)
    } else {
      endTime = getTimeOfDayInSeconds(event.end_time)
    }
  }

  return { secondsForDay, duration: (endTime - secondsForDay) / 60 }
}

export const getTime = dateTime => {
  return dateTime ? moment(dateTime, DAY_FORMAT3).format('HH:mm') : ''
}

export const getTimeFromDateTime = dateTime => {
  return dateTime ? moment(dateTime, DAY_FORMAT4).format('HH:mm') : ''
}

export const getUTCTimeFromDateTime = dateTime => {
  return dateTime ? moment.utc(dateTime, DAY_FORMAT4).format('HH:mm') : ''
}

export const normalizePostCode = postcode => {
  return postcode.toLowerCase()
}

export const generateRandomString = (length = 10) => {
  let text = ''
  let possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  return text
}

export const loadTypeformScript = () => {
  var js,
    q,
    d = document,
    gi = d.getElementById,
    ce = d.createElement,
    gt = d.getElementsByTagName,
    id = 'typef_orm_share',
    b = 'https://embed.typeform.com/'
  if (!gi.call(d, id)) {
    js = ce.call(d, 'script')
    js.id = id
    js.src = b + 'embed.js'
    q = gt.call(d, 'script')[0]
    q.parentNode.insertBefore(js, q)
  }
}

export const getAge = birthdate => {
  const age = birthdate
    ? moment().diff(moment(birthdate, 'YYYY-MM-DD'), 'years')
    : '-'

  return age === 1 ? `${age} Year` : `${age} Years`
}

export function createPOM(POM_NAME = 'Peace Of Mind Policy') {
  const pom = window.RIDETO_PAGE.checkout.addons.find(
    addon => addon.name === POM_NAME
  )
  pom.price = pom.discount_price
  pom.selectedSize = pom.sizes[0]

  return pom
}

export function capitalizeFirstLetter(string) {
  return string.substr(0, 1).toUpperCase() + string.substr(1).toLowerCase()
}

export function getParam(search, name) {
  const params = new URLSearchParams(search)
  const value = params.get(name)
  return value
}

export function setParam(search, name, value) {
  const params = new URLSearchParams(search)
  params.set(name, value)
  return `?${params.toString()}`
}

export function deleteParam(search, name) {
  const params = new URLSearchParams(search)
  params.delete(name)
  return `?${params.toString()}`
}

export function uniqueId() {
  return new Date().valueOf()
}

export function isExternalLink(link) {
  let isInternal = false
  isInternal = link.includes(window.location.host.replace('www.', ''))
  isInternal = link.includes('rideto.com')
  isInternal = link.startsWith('/')

  return !isInternal
}

export function calculatePosition(dayObj) {
  dayObj.courses = _.orderBy(dayObj.courses, 'secondsForDay')
  let sameCourses = _.groupBy(dayObj.courses, 'secondsForDay')
  const tmp = Object.values(sameCourses)
  const maxSame = tmp.length ? Math.max(...tmp.map(x => x.length)) : 0
  dayObj.maxSame = maxSame

  let barMap = []
  let coursePositions = []

  for (let i = 0; i < dayObj.courses.length; i++) {
    let course = dayObj.courses[i]
    if (barMap.length === 0) {
      barMap.push(course)
      coursePositions.push(0)
    } else {
      let j
      for (j = barMap.length - 1; j >= 0; j--) {
        if (
          course.secondsForDay >= barMap[j].secondsForDay &&
          course.secondsForDay <
            barMap[j].secondsForDay + barMap[j].duration * 60
        ) {
          barMap.push(course)
          coursePositions.push(barMap[j].position + 1)
          break
        }
      }
      if (j === -1) {
        barMap.push(course)
        coursePositions.push(0)
      }
    }
    course.sameTime = sameCourses[course.secondsForDay].length
    course.position = coursePositions[i]
  }

  for (let i = 0; i < dayObj.courses.length; i++) {
    let course = dayObj.courses[i]
    if (course.sameTime > 1) {
      course.minStart = Math.min(
        ...sameCourses[course.secondsForDay].map(x => x.position)
      )
    }
  }

  dayObj.barCount = Math.max(...coursePositions) + 1
  dayObj.coursePositions = coursePositions
  return dayObj
}

export function calculateDimension(
  item,
  isDesktop,
  isDay,
  barCount,
  showDetail
) {
  const position = item.position

  let height = item.duration / 60
  let startTime = (item.secondsForDay - WEEK_VIEW_START_TIME) / 3600
  if (startTime < 0) {
    height += startTime
    startTime = 0
  }
  if (startTime + height > WORK_HOURS - 1) {
    height = WORK_HOURS - startTime - 1
    if (height < 0) {
      return null
    }
  }
  let left = `${position * 4}px`
  let width = `calc(100% - ${(barCount - 1) * 4}px)`

  if (isDay) {
    left = `${(100 / barCount) * position}%`
    width = `${100 / barCount}%`
  } else if (showDetail && item.sameTime > 1 && isDesktop) {
    const offset = (4 * (barCount - item.sameTime)) / item.sameTime

    left = `${(100 / item.sameTime) * (position - item.minStart)}% - ${offset *
      (position - item.minStart)}px`
    width = `${100 / item.sameTime}% - ${offset}px`

    if (item.minStart) {
      left = `${4 * item.minStart}px + ${left}`
    }
    left = `calc(${left})`
    width = `calc(${width})`
  }

  return {
    height: `${height * 56}px`,
    top: `${startTime * 56}px`,
    left,
    width
  }
}

function isBankHoliday(holidays, date) {
  return holidays.find(x => x.date === date.format('YYYY-MM-DD'))
}

export function addWeekdays(date, days, bankHolidays) {
  date = moment(date) // use a clone
  while (days > 0) {
    date = date.add(1, 'days')
    // decrease "days" only if it's a weekday.
    if (
      date.isoWeekday() !== 6 &&
      date.isoWeekday() !== 7 &&
      !isBankHoliday(bankHolidays, date)
    ) {
      days -= 1
    }
  }
  return date.format('YYYY-MM-DD')
}

export function removeWeekdays(date, days, bankHolidays) {
  date = moment(date) // use a clone
  while (days > 0) {
    date = date.add(-1, 'days')
    // decrease "days" only if it's a weekday.
    if (
      date.isoWeekday() !== 6 &&
      date.isoWeekday() !== 7 &&
      !isBankHoliday(bankHolidays, date)
    ) {
      days -= 1
    }
  }
  return date.format('YYYY-MM-DD')
}
