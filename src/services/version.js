export const setVersionInfo = () => {
  window.RIDE_TO_VERSION = window.RIDE_TO_VERSION || {}

  window.RIDE_TO_VERSION.commit = process.env.CI_COMMIT_SHA
  window.RIDE_TO_VERSION.branch = process.env.CI_COMMIT_REF_SLUG
  window.RIDE_TO_VERSION.tag = process.env.CI_COMMIT_TAG
}
