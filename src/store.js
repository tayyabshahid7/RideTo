import { createStore, applyMiddleware, compose } from "redux";
import { connectRouter, routerMiddleware } from "connected-react-router";
import thunk from "redux-thunk";
import history from "./history1";
import rootReducer from "./reducers/index";

export default function configureStore(preloadedState) {
  const middleware = routerMiddleware(history);
  const composeEnhancers =
    typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        })
      : compose;

  const enhancers = applyMiddleware(middleware, thunk);

  const store = createStore(
    connectRouter(history)(rootReducer),
    preloadedState,
    process.env.NODE_ENV !== "production"
      ? composeEnhancers(enhancers)
      : enhancers
  );
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept("./reducers", () => {
      const nextRootReducer = require("./reducers/index");
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
