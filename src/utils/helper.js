import moment from 'moment'
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

export function getTimeOfDayInSeconds(time) {
  return moment(time).diff(moment(time).startOf('day'), 'seconds')
}

export function secondsForDayAndDurationForEvent(event, fullDate) {
  let date = moment(new Date(fullDate)).format(DATE_FORMAT)
  let eventDate = moment(new Date(event.start_time)).format(DATE_FORMAT)
  let eventEndDate = moment(new Date(event.end_time)).format(DATE_FORMAT)
  let secondsForDay = WEEK_VIEW_START_TIME
  if (eventDate === date) {
    secondsForDay = getTimeOfDayInSeconds(event.start_time)
  }

  let endTime = WEEK_VIEW_START_TIME + WORK_HOURS * 3600
  if (eventEndDate === date) {
    endTime = getTimeOfDayInSeconds(event.end_time)
  }

  return { secondsForDay, duration: (endTime - secondsForDay) / 60 }
}

export const getTime = dateTime => {
  return dateTime ? moment(dateTime, DAY_FORMAT3).format('HH:mm') : ''
}

export const getTimeFromDateTime = dateTime => {
  return dateTime ? moment(dateTime, DAY_FORMAT4).format('HH:mm') : ''
}

export const normalizePostCode = postcode => {
  return postcode
    .toLowerCase()
    .replace(/\s/g, '')
    .replace(/-/g, '')
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
