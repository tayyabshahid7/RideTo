import { setVersionInfo } from 'services/version'

describe('setVersionInfo', () => {
  beforeEach(() => {
    global.process.env.CI_COMMIT_SHA =
      '540edd20356812a2b9b1699e5b1b46eba647a6e6'
    global.process.env.CI_COMMIT_REF_SLUG = 'staging'
    global.process.env.CI_COMMIT_TAG = '0.1.1'
  })

  it('Sets commit, branch, tag', () => {
    setVersionInfo()
    expect(window.RIDE_TO_VERSION.commit).toBe(
      '540edd20356812a2b9b1699e5b1b46eba647a6e6'
    )
    expect(window.RIDE_TO_VERSION.branch).toBe('staging')
    expect(window.RIDE_TO_VERSION.tag).toBe('0.1.1')
  })
})
