import { get, put } from 'services/api'
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
  const path = `dashboard/${user_id}/timeline`
  const params = {
    name,
    constant,
    is_completed
  }

  return await put(path, params)
}

export const fetchUserDetails = async userId => {
  return await get(`dashboard/${userId}/`)
}
