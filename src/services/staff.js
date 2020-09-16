import { get, destroy, post, put } from 'services/api'

const cleanUpDiary = diary => {
  diary.instructor_id = diary.instructor_id || diary.instructor
  diary.supplier_id = diary.supplier_id || diary.supplier
  delete diary.instructor
  delete diary.supplier

  return diary
}

export const fetchDiaries = async (startDate, endDate) => {
  const path = `school/instructor/shift-diaries`
  const params = {
    sdate: startDate,
    edate: endDate
  }

  const results = await get(path, params)
  return results.map(x => cleanUpDiary(x))
}

export const createDiary = async data => {
  const path = `school/instructor/${data.instructor_id}/shift-diary`
  const diaries = await post(path, data)
  diaries.forEach(diary => cleanUpDiary(diary))
  return diaries
}

export const fetchSingleDiary = async (staffId, diaryId) => {
  const path = `school/instructor/${staffId}/shift-diary/${diaryId}`
  const response = await get(path)
  return cleanUpDiary(response)
}

export const deleteSingleDiary = async (staffId, diaryId) => {
  const path = `school/instructor/${staffId}/shift-diary/${diaryId}`
  return await destroy(path, {})
}

export const updateSingleDiary = async (staffId, diaryId, data) => {
  const path = `school/instructor/${staffId}/shift-diary/${diaryId}`
  const response = await put(path, data)
  response.id = parseInt(diaryId)
  return cleanUpDiary(response)
}
