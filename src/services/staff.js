import { get, destroy, post, put, patch } from 'services/api'

export const fetchStaff = async (schoolId, startDate, endDate) => {
  const path = `school/${schoolId}/diary`
  const params = {
    sdate: startDate,
    edate: endDate
  }

  const response = await get(path, params)

  return response
}

export const fetchSingleStaff = async (schoolId, staffId, diaryId) => {
  const path = `school/${schoolId}/instructor/${staffId}/diary/${diaryId}`

  const response = await get(path)

  return response
}

export const deleteSingleStaff = async (schoolId, staffId, diaryId) => {
  const path = `school/${schoolId}/instructor/${staffId}/diary/${diaryId}`

  const response = await destroy(path, {})

  return response
}

export const updateSchoolStaff = async (
  schoolId,
  staffId,
  diaryId,
  data,
  fullUpdate = false
) => {
  const path = `school/${schoolId}/instructor/${staffId}/diary/${diaryId}`
  let response
  if (fullUpdate) {
    response = await put(path, data)
  } else {
    response = await patch(path, data)
  }
  return response
}

export const createSchoolStaff = async (schoolId, data) => {
  const path = `school/${schoolId}/instructor/${data.instructor}/diary`
  const response = await post(path, data)
  return response
}

export const reduceDiary = (arr, item) => {
  return [
    ...arr,
    ...item.diary.map(d => ({
      ...d,
      instructorName: `${item.first_name} ${item.last_name}`,
      color: item.colour
    }))
  ]
}
