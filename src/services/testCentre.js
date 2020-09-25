import { get, post } from 'services/api'

export const fetchTestCentres = async () => {
  const path = `config/test-centres`

  const response = await get(path)

  return response
}

export const fetchDefaultTestCentres = async () => {
  const path = `school/default-test-centre`

  const response = await get(path)

  return response.test_centres
}

export const updateDefaultTestCentres = async data => {
  const path = `school/default-test-centre`

  const response = await post(path, { test_centres: data })

  return response
}
