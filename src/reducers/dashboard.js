import * as types from "../actionTypes";

const initialState = {
  loading: false,
  error: null,
  pendingOrders: null,
  page: 1
};

export const dashboard = (state = initialState, action) => {
  switch (action.type) {
    case types.PENDING_ORDERS_REQUEST:
      return {
        ...state,
        loading: true
      };
    case types.PENDING_ORDERS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case types.PENDING_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        pendingOrders: action.data
      };
    case types.PENDING_ORDERS_PAGE_CHANGE:
      return {
        ...state,
        page: action.page
      };
    case types.LOGOUT:
    case types.RESET:
      return { ...initialState };
    default:
      return state;
  }
};
