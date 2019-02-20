import { get } from 'services/api'

export const fetchTestCentres = async () => {
  const path = `config/test-centres`

  const response = await get(path)

  return response
}
