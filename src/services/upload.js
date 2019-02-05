import { post } from 'services/api'

export const uploadFile = async (schoolId, file) => {
  const data = new FormData()
  data.append('file', file, file.name)

  const response = await post(
    `school/${schoolId}/upload-csv/`,
    data,
    true,
    'multipart/form-data'
  )
  return response
}
