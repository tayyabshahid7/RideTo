import { get } from 'services/api'

export const fetchArticles = async (page, style, goal) => {
  const path = `dashboard/dashboard-advice/`
  const params = {
    page,
    style,
    goal
  }

  const response = await get(path, params)

  return response
}
