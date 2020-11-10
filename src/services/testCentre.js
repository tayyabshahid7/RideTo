import { get, post } from 'services/api'

export const fetchTestCentres = async () => {
  const path = `config/test-centres`

  const response = await get(path)

  return response
}

export const fetchDefaultTestCentres = async () => {
  const path = `school/default-test-centre`

  const response = await get(path)

  return response.default_test_centres
}

export const updateDefaultTestCentres = async data => {
  const path = `school/default-test-centre`

  const response = await post(path, { default_test_centres: data })

  return response
}
