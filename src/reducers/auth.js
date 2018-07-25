import * as types from "../actionTypes";
import { setToken, removeToken } from "../services/auth";
import { clearState } from "../services/localStorage";

const initialState = {
  loading: false,
  loggedIn: false,
  schoolId: null,
  schoolName: null,
  error: null,
  user: null
};

export const auth = (state = initialState, action) => {
  switch (action.type) {
    case types.CHANGE_SCHOOL:
      return {
        ...state,
        schoolId: action.school.id,
        schoolName: action.school.name
      };

    case types.LOGIN_REQUEST:
      return {
        ...state,
        loading: true
      };
    case types.LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        loggedIn: false,
        error: action.error
      };
    case types.LOGIN_SUCCESS:
      setToken(action.data.token);
      return {
        ...state,
        loading: false,
        loggedIn: true,
        error: null,
        schoolId: action.data.user.suppliers[0].id,
        schoolName: action.data.user.suppliers[0].name,
        user: action.data.user
      };
    case types.LOGOUT:
      clearState();
      removeToken();
      return { ...initialState };
    case types.RESET:
      removeToken();
      return { ...initialState };
    default:
      return state;
  }
};
