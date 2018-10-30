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
