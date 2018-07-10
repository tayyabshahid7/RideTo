import React from 'react'
import { withRouter } from 'react-router-dom'

const AuthButton = withRouter(connect()(
  ({ loginReducer, history }) =>
    localStorage.getItem('token') ? (
      <p>
        Welcome!{loginReducer.session.user.first_name}
        <button onClick={
          () => {
            sessionStorage.removeItem('token')
            history.push("/")
          }
        }>
          Sign out
        </button>
      </p>
    ) : (
      <p>You are not logged in.</p>
    )
));