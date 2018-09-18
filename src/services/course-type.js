import { get } from 'services/api'

export const fetchCoursesTypes = async postCode => {
  const path = `course-types`
  const params = {
    postcode: postCode
  }

  return await get(path, params, false)
}
