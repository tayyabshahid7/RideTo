import { AuthManager } from "../utils";

import {
  REQUEST,
  SUCCESS,
  FAILURE,
  LOGIN,
  SIGNUP,
  LOGOUT
} from "../actionTypes";

const initialState = {
  user: null,
  autoLoggingIn: true,
  signedUp: false,
  isLoading: false,
  error: null
};

export const auth = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN[REQUEST]:
    case SIGNUP[REQUEST]:
      return {
        ...state,
        error: null,
        isLoading: true
      };

    case LOGIN[SUCCESS]:
      AuthManager.saveAuthentication(action.data);
      return {
        ...state,
        error: null,
        user: action.data.user,
        isLoading: false
      };

    case SIGNUP[SUCCESS]:
      return {
        ...state,
        error: null,
        signedUp: true,
        isLoading: false
      };
    case LOGOUT:
      AuthManager.clearAuthentication();
      return {
        ...state,
        user: null
      };
    case SIGNUP[FAILURE]:
    case LOGIN[FAILURE]:
      return {
        ...state,
        error: action.error,
        isLoading: false
      };

    default:
      return state;
  }
};
