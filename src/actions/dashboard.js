import { apiGetPendingOrders } from "../services/api";
import * as types from "../actionTypes";
import { reset as loginReset } from "./authActions";

const pendingOrdersRequest = () => ({ type: types.PENDING_ORDERS_REQUEST });
const pendingOrdersSuccess = data => ({
  type: types.PENDING_ORDERS_SUCCESS,
  data
});

const pendingOrdersError = error => ({
  type: types.PENDING_ORDERS_ERROR,
  error
});

export const changePage = page => ({
  type: types.PENDING_ORDERS_PAGE_CHANGE,
  page
});

export const getPendingOrders = (schoolId, page = 1) => {
  return async dispatch => {
    dispatch(pendingOrdersRequest());
    try {
      const token = localStorage.getItem("token");
      const response = await apiGetPendingOrders(schoolId, page, token);
      if (response.status === 200) {
        dispatch(changePage(page));
        dispatch(pendingOrdersSuccess(response.data));
      } else {
        throw response;
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          //Unauthorized access
          dispatch(loginReset());
        } else {
          dispatch(pendingOrdersError(error.response));
        }
      } else {
        dispatch(pendingOrdersError("Check your internet connection"));
      }
    }
  };
};
