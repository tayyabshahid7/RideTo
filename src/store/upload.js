import { uploadFile as uploadFileApi } from 'services/upload'

import { REQUEST, SUCCESS, FAILURE, createRequestTypes } from './common'

const UPLOAD_FILE = createRequestTypes('UPLOAD_FILE')

export const uploadFile = ({ schoolId, file }) => async dispatch => {
  dispatch({ type: UPLOAD_FILE[REQUEST] })
  try {
    await uploadFileApi(schoolId, file)
    dispatch({
      type: UPLOAD_FILE[SUCCESS]
    })
  } catch (error) {
    dispatch({ type: UPLOAD_FILE[FAILURE], error })
  }
}

const initialState = {
  error: null,
  saving: false
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case UPLOAD_FILE[REQUEST]:
      return {
        ...state,
        saving: true,
        error: null
      }
    case UPLOAD_FILE[SUCCESS]:
      return {
        ...state,
        saving: false
      }
    case UPLOAD_FILE[FAILURE]:
      return {
        ...state,
        saving: false,
        error: action.error
      }
    default:
      return state
  }
}
