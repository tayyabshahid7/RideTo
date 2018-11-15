import { get, post } from 'services/api'
import { requestToken } from 'services/auth'

export const saveUser = async user => {
  const path = 'users/signup/'
  const { email, password } = user
  await post(path, { ...user }, false)

  return await requestToken(email, password)
}

export const fetchUser = async username => {
  return await get(`users/${username}`, {}, false)
}

export const fetchOrders = async username => {
  return await get(`users/order`, { username })
}

export const fetchOrder = async orderId => {
  return await get(`users/order/${orderId}`, {}, false)
}

export const getChecklist = () => {
  return [
    {
      text: 'Add a Bike to your garage',
      checked: true
    },
    {
      text: 'Book your CBT Training',
      checked: true
    },
    {
      text: 'Get a Bike Quote',
      href: 'https://www.rideto.com/bike-sales',
      checked: false
    },
    {
      text: 'Get an Insurance Quote',
      href: 'http://www.lexhaminsurance.co.uk/?aff=LEX6327',
      checked: false
    },
    {
      text: 'Shop Helmet & Gloves',
      href: 'https://www.sportsbikeshop.co.uk/#/23639,0,0',
      checked: false
    }
  ]
}
