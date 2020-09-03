import { get, destroy, post, put, patch } from 'services/api'

export const fetchEvents = async (schoolId, startDate, endDate) => {
  const path = `school/${schoolId}/event`
  const params = {
    sdate: startDate,
    edate: endDate
  }

  const response = await get(path, params)

  return response
}

export const fetchSingleEvent = async eventId => {
  const path = `school/event/${eventId}`

  const response = await get(path, {})

  return response
}

export const deleteSingleEvent = async eventId => {
  const path = `school/event/${eventId}`

  const response = await destroy(path, {})

  return response
}

export const updateSchoolEvent = async (eventId, data, fullUpdate = false) => {
  const path = `school/event/${eventId}`
  let response
  if (fullUpdate) {
    response = await put(path, data)
  } else {
    response = await patch(path, data)
  }
  return response
}

export const createSchoolEvent = async (schoolId, data) => {
  const path = `school/${schoolId}/event`
  const response = await post(path, data)
  return response
}
