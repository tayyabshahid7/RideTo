import { get, post } from 'services/api'
import { requestToken } from 'services/auth'
import { normalizePostCode } from 'utils/helper'

export const saveCheckoutEmail = async (email, course) => {
  const path = `save-checkout-email`
  const response = await post(
    path,
    {
      email,
      course: {
        ...course,
        url: `/course-location/?postcode=${normalizePostCode(
          course.postcode
        )}&courseType=${course.courseType}&courseId=${course.supplierId}`
      }
    },
    false
  )
  return response
}

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
      text: 'Book your training',
      checked: true
    },
    {
      text: 'Get a Bike Quote',
      href: 'https://www.rideto.com/bike-reviews',
      checked: false
    },
    {
      text: 'Get an Insurance Quote',
      href:
        'https://www.thebikeinsurer.co.uk/cheapest-quote-ride-to/?refid=AWIN-403899&awc=7856_1549907194_13aad8aa82865c266eb1627aaceaa38d&utm_source=https%3A%2F%2Fwww.rideto.co%2F-403899&utm_medium=AWIN&utm_campaign=Social+Content&utm_content=null',
      checked: false
    },
    {
      text: 'Shop Helmet & Gloves',
      href: 'https://www.sportsbikeshop.co.uk/#/23639,0,0',
      checked: false
    }
  ]
}
