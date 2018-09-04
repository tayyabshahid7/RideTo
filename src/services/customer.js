import { get, post, put } from 'services/api'

export const fetchCustomers = async (params = {}) => {
  const path = `school/customer`
  const response = await get(path, params)

  return response
}

export const fetchCustomer = async (id, params = {}) => {
  const path = `school/customer/${id}`
  const response = await get(path, params)

  return response
}

export const saveCustomer = async customer => {
  const { id } = customer
  const path = id ? `school/customer/${id}` : `school/customer`
  const method = id ? put : post

  return await method(path, customer)
}

export const getCurrentLicenceOptions = () => {
  return [
    {
      id: 'CURRENT_LICENCES_PROVISIONAL_LICENCE',
      name: 'UK Provisional Licence'
    },
    {
      id: 'CURRENT_LICENCES_DRIVING_LICENCE',
      name: 'UK Driving Licence'
    },
    {
      id: 'CURRENT_LICENCES_CBT',
      name: 'CBT Certificate'
    },
    {
      id: 'CURRENT_LICENCES_FULL_EU_DRIVING_LICENCE',
      name: 'EU Licence (with UK counterpart licence number)'
    }
  ]
}

export const getRidingExperienceOptions = () => {
  return ['Cycling', 'Off road motorcycling', 'On road motorcycling'].map(
    opt => {
      return { name: opt, id: opt }
    }
  )
}

export const getCustomerType = source => {
  switch (source) {
    case 'RIDETO':
      return 'RideTo Rider'
    default:
      return 'Direct'
  }
}

export const getEmptyCustomer = source => {
  return {
    source
  }
}
