import React from 'react'
import { NavLink } from 'react-router-dom'
import Header from '../Header'
import UserMenu from '../UserMenu'
import styles from './styles.scss'

let NavigationBar = ({ history }) => {
  return (
    <Header>
      <div className={styles.container}>
        <div className={styles.navLinks}>
          <NavLink
            className={styles.navLink}
            activeClassName={styles.activeNavLink}
            exact
            to="/">
            Home
          </NavLink>
          <NavLink
            className={styles.navLink}
            activeClassName={styles.activeNavLink}
            to="/orders">
            Orders
          </NavLink>
          <NavLink
            className={styles.navLink}
            activeClassName={styles.activeNavLink}
            to="/calendar">
            Calendar
          </NavLink>
        </div>
        <div className={styles.authMenu}>
          <UserMenu history={history} />
        </div>
      </div>
    </Header>
  )
}

export default NavigationBar
