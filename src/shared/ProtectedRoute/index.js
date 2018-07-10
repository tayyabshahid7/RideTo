
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from 'services/utils'

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={ (props) => 
      sessionStorage.getItem('token')? 
        <Component {...props} />
      : 
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
    }
  />
)


export default ProtectedRoute