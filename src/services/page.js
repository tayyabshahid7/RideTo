export const getStaticData = pageId => {
  if (window) {
    return window[pageId]
  }
}

export const getAddons = () => {
  const staticData = getStaticData('RIDETO_PAGE')
  return staticData.checkout.addons
}

export const getSupplier = () => {
  const staticData = getStaticData('RIDETO_PAGE')
  return staticData.checkout.supplier
}

export const getDashboardAdvice = () => {
  const staticData = getStaticData('RIDETO_PAGE')
  return staticData.dashboardAdvice
}

export const isInstantBook = () => {
  const staticData = getStaticData('RIDETO_PAGE')
  return staticData.checkout.instant_book
}

export const getCourseTypesData = () => {
  const staticData = getStaticData('RIDETO_PAGE')
  return staticData.courseTypes
}

export const flashDiv = id => {
  let el = document.getElementById(id)

  if (el) {
    el.classList.remove('highlight-required')
    if (!window.isSupplier) {
      el.scrollIntoView()
    }
    el.classList.add('highlight-required')
  }
}

// Insert param key without refresh the page
export function insertUrlParam(key, value) {
  if (window.history.pushState) {
    let searchParams = new URLSearchParams(window.location.search)
    searchParams.set(key, value)
    let newurl =
      window.location.protocol +
      '//' +
      window.location.host +
      window.location.pathname +
      '?' +
      searchParams.toString()
    window.history.pushState({ path: newurl }, '', newurl)
  }
}

// to remove the specific key
export function removeUrlParameter(paramKey) {
  const url = window.location.href
  var r = new URL(url)
  r.searchParams.delete(paramKey)
  const newUrl = r.href
  window.history.pushState({ path: newUrl }, '', newUrl)
}
