import React from 'react'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import styles from './styles.scss'

let AccountSubNavbar = ({ history }) => {
  return (
    <div className={styles.container}>
      <ul className={classnames('navbar-nav mr-auto', styles.linkContainer)}>
        <li className="nav-item">
          <NavLink
            className={styles.navLink}
            activeClassName={styles.activeNavLink}
            exact
            to="/account/availability">
            Availability &amp; Courses
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className={styles.navLink}
            activeClassName={styles.activeNavLink}
            to="/account/account">
            Account
          </NavLink>
        </li>
      </ul>
    </div>
  )
}

export default AccountSubNavbar
