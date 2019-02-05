import { get } from 'services/api'
import { BANK_HOLIDAYS } from 'common/constants'

export const fetchAddressWithPostcode = async params => {
  const path = `postcode`

  const response = await get(path, params, false)

  return response
}

export const isBankHoliday = date => {
  return BANK_HOLIDAYS.includes(date)
}
