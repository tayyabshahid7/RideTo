import { get, put, post } from 'services/api'
import {
  getUserProfile,
  getToken,
  isAuthenticated as getIsAuthenticated
} from 'services/auth'

export const fetchArticles = async (page, style, goal) => {
  const path = `dashboard/dashboard-advice/`
  const params = {
    page,
    style,
    goal
  }

  const response = await get(path, params, false)

  return response
}

export const updateTimelineStep = async (name, constant, is_completed) => {
  const isAuthenticated = getIsAuthenticated()

  if (!isAuthenticated) {
    return
  }

  const { user_id } = getUserProfile(getToken())
  const path = `dashboard/${user_id}/timeline/`
  const params = {
    name,
    constant,
    is_completed
  }

  return await put(path, params)
}

export const updateAchievement = async ({ name, constant }) => {
  const isAuthenticated = getIsAuthenticated()

  if (!isAuthenticated) {
    return
  }

  const { user_id } = getUserProfile(getToken())
  const path = `dashboard/${user_id}/achievement/`
  const params = {
    name,
    constant
  }

  return await post(path, params)
}

export const updateUserDetail = async (key, value) => {
  const isAuthenticated = getIsAuthenticated()

  if (!isAuthenticated) {
    return
  }

  const { user_id } = getUserProfile(getToken())
  const path = `dashboard/${user_id}/`
  const params = {
    [key]: value
  }

  return await put(path, params)
}

export const fetchUserDetails = async userId => {
  return await get(`dashboard/${userId}/`)
}

export const fetchIsPasswordSet = async () => {
  return await get('users/has-password-set/')
}

export const updateUserPassword = async password => {
  const isAuthenticated = getIsAuthenticated()

  if (!isAuthenticated) {
    return
  }

  const path = 'users/password-reset-token/'
  const params = {
    new_password: password
  }

  const response = await put(path, params)

  return response
}

export const fetchBikes = async ({ constant }) => {
  const licence =
    constant === 'GOAL_SOCIAL_ANY_BIKE' ? 'FULL_LICENCE' : 'LICENCE_CBT'
  const path = `dashboard/dashboard-bike/`
  const params = {
    licence
  }

  const response = await get(path, params, false)

  return response
}

export const recordGAEcommerceData = order => {
  if (order && window.localStorage.getItem('gaok') === 'true') {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      transactionId: order.friendly_id,
      transactionAffiliation: 'RideTo',
      transactionTotal: order.revenue,
      transactionProducts: [
        {
          sku: order.friendly_id,
          name: order.selected_licence,
          category: order.supplier_name,
          price: order.revenue,
          quantity: 1
        }
      ],
      event: 'rideto.ecom-purchase.completed'
    })
    window.localStorage.removeItem('gaok')
  }
}
