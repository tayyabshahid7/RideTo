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
