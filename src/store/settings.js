import { getSettings, saveSettings } from 'services/settings'
import { createRequestTypes, REQUEST, SUCCESS, FAILURE } from './common'

const FETCH_SETTING = createRequestTypes('rideto/settings/FETCH')
const UPDATE_SETTING = createRequestTypes('rideto/settings/UPDATE')

export const fetchSettings = () => async dispatch => {
  dispatch({ type: FETCH_SETTING[REQUEST] })

  try {
    const settings = await getSettings()
    dispatch({
      type: FETCH_SETTING[SUCCESS],
      data: {
        settings
      }
    })
  } catch (error) {
    dispatch({ type: FETCH_SETTING[FAILURE], error })
  }
}

export const updateSettings = data => async dispatch => {
  dispatch({ type: UPDATE_SETTING[REQUEST] })

  try {
    const settings = await saveSettings(data)

    dispatch({
      type: UPDATE_SETTING[SUCCESS],
      data: {
        settings
      }
    })
  } catch (error) {
    dispatch({ type: UPDATE_SETTING[FAILURE], error })
  }
}

const initialState = {
  settings: null,
  loading: false,
  saving: false,
  error: null
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_SETTING[REQUEST]:
      return {
        ...state,
        loading: true,
        error: null
      }
    case FETCH_SETTING[SUCCESS]:
      return {
        ...state,
        loading: false,
        settings: action.data.settings
      }
    case FETCH_SETTING[FAILURE]:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case UPDATE_SETTING[REQUEST]:
      return {
        ...state,
        saving: true,
        error: null
      }
    case UPDATE_SETTING[SUCCESS]:
      return {
        ...state,
        saving: false,
        settings: action.data.settings
      }
    case UPDATE_SETTING[FAILURE]:
      return {
        ...state,
        saving: false,
        error: action.error
      }
    default:
      return state
  }
}
