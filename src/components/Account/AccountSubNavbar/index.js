import React from 'react'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import styles from './styles.scss'

let AccountSubNavbar = ({ history }) => {
  return (
    <div className={styles.container}>
      <ul className={classnames('navbar-nav', styles.linkContainer)}>
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
        <li className="nav-item">
          <NavLink
            className={styles.navLink}
            activeClassName={styles.activeNavLink}
            to="/account/widget-settings">
            Booking Widget
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className={styles.navLink}
            activeClassName={styles.activeNavLink}
            to="/account/csv-upload">
            Upload Tests
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className={styles.navLink}
            activeClassName={styles.activeNavLink}
            to="/account/emails">
            Emails
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className={styles.navLink}
            activeClassName={styles.activeNavLink}
            to="/account/instructors">
            Instructors
          </NavLink>
        </li>
      </ul>
    </div>
  )
}

export default AccountSubNavbar
