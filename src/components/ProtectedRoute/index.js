import React from 'react'
import { Route, Redirect } from 'react-router'
import { isAuthenticated } from '../../services/auth'

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/home',
            state: { from: props.location }
          }}
        />
      )
    }
  />
)

export default ProtectedRoute
