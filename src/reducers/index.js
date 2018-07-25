import { combineReducers } from "redux";
import { dashboard } from "./dashboard";
import { orders } from "./orders";
import { auth } from "./auth";

const appReducer = combineReducers({
  auth,
  dashboard,
  orders
});
export default appReducer;
