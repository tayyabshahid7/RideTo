import * as types from "../actionTypes";
import { setToken, removeToken } from "../services/auth";

const initialState = {
  loading: false,
  loggedIn: false,
  schoolId: null,
  schoolName: null,
  error: null,
  session: {
    user: null
  }
};

export const login = (state = initialState, action) => {
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
      console.log("HALA token", action.data.token);
      return {
        ...state,
        loading: false,
        loggedIn: true,
        error: null,
        schoolId: action.data.user.suppliers[0].id,
        schoolName: action.data.user.suppliers[0].name,
        session: {
          user: action.data.user
        }
      };
    case types.LOGOUT:
      removeToken();
      return {
        ...state,
        loggedIn: false,
        schoolId: null,
        error: null,
        session: null
      };
    case types.RESET:
      removeToken();
      return { ...initialState };
    default:
      return state;
  }
};
