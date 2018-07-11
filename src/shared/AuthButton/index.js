import React from 'react'
import { connect } from 'react-redux'
import { withRouter, NavLink } from 'react-router-dom'
import styles from './styles.scss'

const AuthButton = withRouter(connect()(
  ({history }) =>
    sessionStorage.getItem('token') &&
    <div className={styles.container}>
      <button onClick={
        () => {
          sessionStorage.removeItem('token')
          history.push("/")
        }
      }>
        Logout
      </button>
    </div>
));

export default AuthButton