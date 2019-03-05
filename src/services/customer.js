import { get, post, destroy, patch } from 'services/api'

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
  const method = id ? patch : post
  const data = customer.rideto_email
    ? { ...customer, email: customer.rideto_email }
    : { ...customer }

  return await method(path, data)
}

export const destroyCustomer = async id => {
  const path = `school/customer/${id}`
  return await destroy(path, id)
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
      id: 'CURRENT_LICENCES_FULL_EU_DRIVING_LICENCE',
      name: 'EU Licence (with UK counterpart licence number)'
    }
  ]
}

export const getRidingExperienceOptions = () => {
  return [
    'Cycling experience',
    'Off road motorcycling',
    'On road motorcycling'
  ].map(opt => {
    return { name: opt, id: opt }
  })
}

export const getCustomerType = source => {
  switch (source) {
    case 'RIDETO':
    case 'RIDETO_INSTANT':
      return 'RideTo Rider'
    default:
      return 'Direct'
  }
}

export const getBooleanSelectOptions = () => {
  return [{ name: 'No', id: 'false' }, { name: 'Yes', id: 'true' }]
}

export const getEmptyCustomer = source => {
  return {
    source
  }
}

export const isRideTo = ({ source }) => {
  return source === 'RIDETO' || source === 'RIDETO_INSTANT'
}
