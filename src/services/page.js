export const getStaticData = pageId => {
  if (window) {
    return window[pageId]
  }
}
