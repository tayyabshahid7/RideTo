import { get } from 'services/api'

export const fetchCoursesTypes = async postCode => {
  const path = `course-types`
  const params = {
    postcode: postCode
  }

  return await get(path, params, false)
}

export const getFilters = () => {
  return [
    { tag: 'ALL', name: 'All' },
    { tag: 'BEGINNER', name: 'Beginner' },
    { tag: 'ADVANCED', name: 'Experienced' },
    { tag: 'CBT', name: 'CBT' },
    { tag: 'FULL', name: 'Full Licence' }
  ]
}

export const getFiltersTag = () => {
  return ['ALL', 'BEGINNER', 'ADVANCED', 'CBT', 'FULL']
}
