import { get, post } from 'services/api'

export const saveUser = async user => {
  const path = 'users/signup/'

  return await post(path, { ...user }, false)
}

export const fetchUser = async () => {
  return await get('users/')
}

export const fetchOrders = async () => {
  return await get('users/order/')
}

export const fetchOrder = async orderId => {
  return await get(`users/order/${orderId}`)
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
      href: '/bikes',
      checked: false
    },
    {
      text: 'Get an Insurance Quote',
      href: '/insurance',
      checked: false
    },
    {
      text: 'Shop Helmet & Gloves',
      href: '/',
      checked: false
    }
  ]
}
