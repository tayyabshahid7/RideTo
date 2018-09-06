import { refreshToken, requestToken, isTokenExpiring } from 'services/auth'
import * as api from 'services/api'

const TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo2MywidXNlcm5hbWUiOiJzdHVhcnQucXVpbkBnbWFpbC5jb20iLCJleHAiOjE1MzU5ODc2MTYsImVtYWlsIjoic3R1YXJ0LnF1aW5AZ21haWwuY29tIiwib3JpZ19pYXQiOjE1MzU5ODY0MDd9.smFnRiay6DQ4baLxvDr7zIEYPx0iTMCEWCoDdtMHGYk'
const EXPIRY = 1535987616

let _post

beforeEach(() => {
  _post = api.post
  global.localStorage = { setItem: jest.fn() }

  api.post = jest.fn(() => {
    return { token: TOKEN }
  })
})

afterEach(() => {
  api.post = _post
  global.localStorage.setItem.mockReset()
})

describe('isTokenExpiring', () => {
  let _Date

  beforeEach(() => {
    _Date = global.Date
  })

  afterEach(() => {
    global.Date = _Date
  })

  it('Returns true if time below threshold', () => {
    const MOCK_NOW = new _Date((EXPIRY - 60 * 3) * 1000)
    global.Date = {
      now: jest.fn(() => MOCK_NOW)
    }

    expect(isTokenExpiring(TOKEN)).toBe(true)
  })

  it('Returns false if time already expired', () => {
    const MOCK_NOW = new _Date((EXPIRY + 60 * 10) * 1000)
    global.Date = {
      now: jest.fn(() => MOCK_NOW)
    }

    expect(isTokenExpiring(TOKEN)).toBe(false)
  })

  it('Returns false if time above threshold', () => {
    const MOCK_NOW = new _Date((EXPIRY - 60 * 10) * 1000)
    global.Date = {
      now: jest.fn(() => MOCK_NOW)
    }

    expect(isTokenExpiring(TOKEN)).toBe(false)
  })
})

describe('requestToken', () => {
  let _setItem = jest.fn()

  beforeEach(() => {
    global.localStorage = { setItem: _setItem }
  })

  afterEach(() => {
    _setItem.mockReset()
  })

  it('Makes post', () => {
    requestToken('test@mail.com', 'secret')

    expect(api.post).toHaveBeenCalledWith(
      'users/login/',
      { email: 'test@mail.com', password: 'secret' },
      false
    )
  })

  it('Sets token in localStorage', async done => {
    await requestToken('test@mail.com', 'secret')
    expect(_setItem).toHaveBeenCalledWith('token', TOKEN)
    done()
  })
})

describe('refreshToken', () => {
  it('Makes post', () => {
    refreshToken(TOKEN)

    expect(api.post).toHaveBeenCalledWith(
      'users/refresh/',
      { token: TOKEN },
      false
    )
  })

  it('Sets refreshed token in localStorage', async done => {
    api.post = jest.fn(() => {
      return { token: 'NewToken' }
    })
    await refreshToken(TOKEN)

    expect(global.localStorage.setItem).toHaveBeenCalledWith(
      'token',
      'NewToken'
    )
    done()
  })
})
