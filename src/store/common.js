export const REQUEST = 'REQUEST'
export const SUCCESS = 'SUCCESS'
export const FAILURE = 'FAILURE'

export function createRequestTypes(base) {
  return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
    acc[type] = `${base}_${type}`
    return acc
  }, {})
}

export const normalize = (items, idField = 'id') => {
  return items.reduce((normalized, item) => {
    return {
      ...normalized,
      [item[idField]]: item
    }
  }, {})
}

const constant = (moduleName, name) => {
  return `riderto/${moduleName}/${name}`
}

const fetch = (moduleName, fetchFn) => (...args) => dispatch => {
  dispatch({ type: constant(moduleName, 'FETCH') })

  try {
    return fetchFn(...args).then(result => {
      dispatch({
        type: constant(moduleName, 'FETCH_SUCCESS'),
        result
      })
    })
  } catch (error) {
    dispatch({
      type: constant(moduleName, 'ERROR'),
      error
    })
  }
}

const fetchSingle = (moduleName, fetchFn) => (...args) => dispatch => {
  dispatch({ type: constant(moduleName, 'FETCH_SINGLE') })

  try {
    return fetchFn(...args).then(result => {
      dispatch({
        type: constant(moduleName, 'FETCH_SINGLE_SUCCESS'),
        result
      })
    })
  } catch (error) {
    dispatch({
      type: constant(moduleName, 'ERROR'),
      error
    })
  }
}

const save = (moduleName, saveFn) => (...args) => dispatch => {
  dispatch({ type: constant(moduleName, 'SAVE') })

  try {
    return saveFn(...args).then(result => {
      dispatch({
        type: constant(moduleName, 'SAVE_SUCCESS'),
        result
      })
    })
  } catch (error) {
    dispatch({
      type: constant(moduleName, 'ERROR'),
      error
    })
  }
}

const items = (moduleName, idField = 'id') => (state = {}, action) => {
  switch (action.type) {
    case constant(moduleName, 'FETCH_SUCCESS'):
      return {
        ...state,
        ...normalize(action.result.results, idField)
      }
    case constant(moduleName, 'FETCH_SINGLE_SUCCESS'):
      return {
        ...state,
        ...normalize([action.result], idField)
      }
    case constant(moduleName, 'SAVE_SUCCESS'):
      return {
        ...state,
        ...normalize([action.result], idField)
      }
    default:
      return state
  }
}

const isFetchingItems = moduleName => (state = false, action) => {
  switch (action.type) {
    case constant(moduleName, 'FETCH'):
      return true
    case constant(moduleName, 'FETCH_SUCCESS'):
      return false
    case constant(moduleName, 'ERROR'):
      return false
    default:
      return state
  }
}

const isSaving = moduleName => (state = false, action) => {
  switch (action.type) {
    case constant(moduleName, 'SAVE'):
      return true
    case constant(moduleName, 'SAVE_SUCCESS'):
      return false
    case constant(moduleName, 'ERROR'):
      return false
    default:
      return state
  }
}

const results = (moduleName, idField = 'id') => (state = [], action) => {
  switch (action.type) {
    case constant(moduleName, 'FETCH_SUCCESS'):
      return action.result.results.map(r => r[idField])
    default:
      return state
  }
}

const result = (moduleName, idField = 'id') => (state = null, action) => {
  switch (action.type) {
    case constant(moduleName, 'FETCH'):
      return null
    case constant(moduleName, 'SAVE'):
      return null
    case constant(moduleName, 'SAVE_SUCCESS'):
      return action.result[idField]
    default:
      return state
  }
}

const error = moduleName => (state = null, action) => {
  switch (action.type) {
    case constant(moduleName, 'FETCH_SUCCESS'):
      return null
    case constant(moduleName, 'SAVE_SUCCESS'):
      return null
    case constant(moduleName, 'ERROR'):
      return action.error
    default:
      return state
  }
}

const total = moduleName => (state = 0, action) => {
  switch (action.type) {
    case constant(moduleName, 'FETCH_SUCCESS'):
      return action.result.count
    default:
      return state
  }
}

export const LOGOUT = constant('auth', 'LOGOUT')
export const RESET = constant('auth', 'RESET')

export default {
  constant,
  fetch,
  fetchSingle,
  save,
  items,
  results,
  result,
  error,
  isFetchingItems,
  isSaving,
  total
}
